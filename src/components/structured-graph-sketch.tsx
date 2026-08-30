"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState } from "react";

type Point = { x: number; y: number };
type DrawingTool = "line" | "curve" | "quadratic" | "cubic" | "circle" | "label";
type GraphItem =
  | { id: string; type: "line"; points: [Point, Point] }
  | { id: string; type: "curve"; curveType: "smooth" | "quadratic" | "cubic"; points: Point[] }
  | { id: string; type: "circle"; points: [Point, Point] }
  | { id: string; type: "label"; point: Point; text: string };

type StoredGraph = { version: 2; items: GraphItem[] };

const VIEWBOX_WIDTH = 600;
const VIEWBOX_HEIGHT = 360;

const TOOL_OPTIONS: Array<{ id: DrawingTool; label: string; instruction: string }> = [
  { id: "line", label: "Straight line", instruction: "Click two points. Drag either dot to adjust the line." },
  { id: "curve", label: "Point curve", instruction: "Add points along the curve, then select Finish curve." },
  { id: "quadratic", label: "Quadratic", instruction: "Click the left side, turning point and right side." },
  { id: "cubic", label: "Cubic", instruction: "Click four points along the cubic curve." },
  { id: "circle", label: "Circle", instruction: "Click the centre, then a point on the circumference." },
  { id: "label", label: "Label", instruction: "Enter a label, then click where it should appear." },
];

function isPoint(value: unknown): value is Point {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as Point).x === "number" &&
      typeof (value as Point).y === "number",
  );
}

function parseGraph(value: string): GraphItem[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const graph = parsed as Partial<StoredGraph>;
      if (graph.version === 2 && Array.isArray(graph.items)) return graph.items as GraphItem[];
    }
    if (Array.isArray(parsed)) {
      return parsed
        .filter(Array.isArray)
        .map((stroke, index) => ({
          id: `legacy-${index}`,
          type: "curve" as const,
          curveType: "smooth" as const,
          points: stroke.filter(isPoint).filter((_, pointIndex) => pointIndex % 8 === 0),
        }))
        .filter((item) => item.points.length >= 2);
    }
  } catch {
    // Invalid or empty sketches start with a clean graph.
  }
  return [];
}

function smoothPath(points: Point[]) {
  if (points.length < 2) return "";
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midpoint = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
    path += ` Q ${current.x} ${current.y} ${midpoint.x} ${midpoint.y}`;
  }
  const penultimate = points[points.length - 2];
  const last = points[points.length - 1];
  return `${path} Q ${penultimate.x} ${penultimate.y} ${last.x} ${last.y}`;
}

function quadraticPath(points: Point[]) {
  if (points.length !== 3) return smoothPath(points);
  const [start, onCurve, end] = points;
  const control = {
    x: 2 * onCurve.x - (start.x + end.x) / 2,
    y: 2 * onCurve.y - (start.y + end.y) / 2,
  };
  return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
}

function pointFromEvent(event: ReactPointerEvent<SVGSVGElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(VIEWBOX_WIDTH, ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH)),
    y: Math.max(0, Math.min(VIEWBOX_HEIGHT, ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT)),
  };
}

function itemPoints(item: GraphItem): Point[] {
  if (item.type === "label") return [item.point];
  return item.points;
}

export function StructuredGraphSketch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [items, setItems] = useState<GraphItem[]>(() => parseGraph(value));
  const [tool, setTool] = useState<DrawingTool>("line");
  const [pendingPoints, setPendingPoints] = useState<Point[]>([]);
  const [labelText, setLabelText] = useState("");
  const dragRef = useRef<{ itemId: string; pointIndex: number } | null>(null);
  const idRef = useRef(0);

  const nextId = () => {
    idRef.current += 1;
    return `graph-${Date.now()}-${idRef.current}`;
  };
  const commit = (nextItems: GraphItem[]) => {
    setItems(nextItems);
    onChange(JSON.stringify({ version: 2, items: nextItems } satisfies StoredGraph));
  };
  const addItem = (item: GraphItem) => {
    commit([...items, item]);
    setPendingPoints([]);
  };
  const requiredPoints = tool === "line" || tool === "circle" ? 2 : tool === "quadratic" ? 3 : tool === "cubic" ? 4 : null;

  const handleCanvasPoint = (point: Point) => {
    if (tool === "label") {
      if (!labelText.trim()) return;
      addItem({ id: nextId(), type: "label", point, text: labelText.trim().slice(0, 40) });
      setLabelText("");
      return;
    }
    const nextPoints = [...pendingPoints, point];
    if (requiredPoints && nextPoints.length >= requiredPoints) {
      if (tool === "line") addItem({ id: nextId(), type: "line", points: [nextPoints[0], nextPoints[1]] });
      else if (tool === "circle") addItem({ id: nextId(), type: "circle", points: [nextPoints[0], nextPoints[1]] });
      else addItem({ id: nextId(), type: "curve", curveType: tool === "quadratic" ? "quadratic" : "cubic", points: nextPoints });
      return;
    }
    setPendingPoints(nextPoints);
  };

  const finishPointCurve = () => {
    if (pendingPoints.length < 2) return;
    addItem({ id: nextId(), type: "curve", curveType: "smooth", points: pendingPoints });
  };

  const updateDraggedPoint = (point: Point) => {
    const drag = dragRef.current;
    if (!drag) return;
    const nextItems = items.map((item) => {
      if (item.id !== drag.itemId) return item;
      if (item.type === "label") return { ...item, point };
      const points = item.points.map((existing, index) => index === drag.pointIndex ? point : existing);
      if (item.type === "line") return { ...item, points: points as [Point, Point] };
      if (item.type === "circle") return { ...item, points: points as [Point, Point] };
      return { ...item, points };
    });
    commit(nextItems);
  };

  const instruction = TOOL_OPTIONS.find((option) => option.id === tool)?.instruction ?? "";

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 bg-zinc-50/70 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-zinc-800">Graph sketch</p>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => pendingPoints.length ? setPendingPoints((current) => current.slice(0, -1)) : commit(items.slice(0, -1))} disabled={pendingPoints.length === 0 && items.length === 0} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 disabled:opacity-40">Undo</button>
            <button type="button" onClick={() => { setPendingPoints([]); commit([]); }} disabled={pendingPoints.length === 0 && items.length === 0} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 disabled:opacity-40">Clear</button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
          {TOOL_OPTIONS.map((option) => (
            <button key={option.id} type="button" onClick={() => { setTool(option.id); setPendingPoints([]); }} aria-pressed={tool === option.id} className={["rounded-[9px] border px-2 py-2 text-xs font-medium transition", tool === option.id ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"].join(" ")}>{option.label}</button>
          ))}
        </div>
        {tool === "label" ? (
          <input value={labelText} onChange={(event) => setLabelText(event.target.value)} maxLength={40} aria-label="Graph label" className="mt-2 h-9 w-full rounded-[9px] border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-zinc-400" />
        ) : null}
        <div className="mt-2 flex min-h-7 items-center justify-between gap-3">
          <p className="text-xs leading-5 text-zinc-500">{instruction}</p>
          {tool === "curve" && pendingPoints.length >= 2 ? <button type="button" onClick={finishPointCurve} className="shrink-0 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">Finish curve</button> : null}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="aspect-[5/3] w-full touch-none bg-white"
        role="img"
        aria-label="Structured graph drawing area with coordinate axes"
        onPointerDown={(event) => { if (event.target === event.currentTarget) handleCanvasPoint(pointFromEvent(event)); }}
        onPointerMove={(event) => updateDraggedPoint(pointFromEvent(event))}
        onPointerUp={() => { dragRef.current = null; }}
        onPointerCancel={() => { dragRef.current = null; }}
      >
        {Array.from({ length: 21 }, (_, index) => <line key={`v-${index}`} x1={index * 30} y1="0" x2={index * 30} y2={VIEWBOX_HEIGHT} stroke="#f0f0f1" strokeWidth="1" pointerEvents="none" />)}
        {Array.from({ length: 13 }, (_, index) => <line key={`h-${index}`} x1="0" y1={index * 30} x2={VIEWBOX_WIDTH} y2={index * 30} stroke="#f0f0f1" strokeWidth="1" pointerEvents="none" />)}
        <line x1="0" y1="180" x2="600" y2="180" stroke="#a1a1aa" strokeWidth="1.5" pointerEvents="none" />
        <line x1="300" y1="0" x2="300" y2="360" stroke="#a1a1aa" strokeWidth="1.5" pointerEvents="none" />
        <path d="M 590 175 L 600 180 L 590 185" fill="none" stroke="#a1a1aa" strokeWidth="1.5" pointerEvents="none" />
        <path d="M 295 10 L 300 0 L 305 10" fill="none" stroke="#a1a1aa" strokeWidth="1.5" pointerEvents="none" />
        <text x="582" y="169" fontSize="12" fill="#71717a" pointerEvents="none">x</text>
        <text x="309" y="15" fontSize="12" fill="#71717a" pointerEvents="none">y</text>

        {items.map((item) => {
          if (item.type === "line") return <line key={item.id} x1={item.points[0].x} y1={item.points[0].y} x2={item.points[1].x} y2={item.points[1].y} stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" pointerEvents="none" />;
          if (item.type === "circle") {
            const radius = Math.hypot(item.points[1].x - item.points[0].x, item.points[1].y - item.points[0].y);
            return <circle key={item.id} cx={item.points[0].x} cy={item.points[0].y} r={radius} fill="none" stroke="#27272a" strokeWidth="2.5" pointerEvents="none" />;
          }
          if (item.type === "curve") return <path key={item.id} d={item.curveType === "quadratic" ? quadraticPath(item.points) : smoothPath(item.points)} fill="none" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />;
          return <text key={item.id} x={item.point.x} y={item.point.y} fontSize="14" fontWeight="600" fill="#27272a" stroke="white" strokeWidth="4" paintOrder="stroke" pointerEvents="none">{item.text}</text>;
        })}

        {items.flatMap((item) => itemPoints(item).map((point, pointIndex) => (
          <circle key={`${item.id}-point-${pointIndex}`} cx={point.x} cy={point.y} r="5" fill="white" stroke="#71717a" strokeWidth="1.5" onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { itemId: item.id, pointIndex }; }} />
        )))}
        {pendingPoints.length > 1 ? <path d={smoothPath(pendingPoints)} fill="none" stroke="#71717a" strokeWidth="2" strokeDasharray="5 5" pointerEvents="none" /> : null}
        {pendingPoints.map((point, index) => <circle key={`pending-${index}`} cx={point.x} cy={point.y} r="5" fill="#27272a" stroke="white" strokeWidth="2" pointerEvents="none" />)}
      </svg>
    </div>
  );
}
