import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);
const coordinateFiles = [
  "src/components/inequalities-native-lesson.tsx",
  "src/components/quadratic-functions-native-lesson.tsx",
  "src/components/graphs-of-functions-native-lesson.tsx",
  "src/components/modulus-function-native-lesson.tsx",
  "src/components/composite-inverse-functions-native-lesson.tsx",
  "src/components/graph-transformations-native-lesson.tsx",
  "src/components/functions-modelling-native-lesson.tsx",
];

const sources = coordinateFiles.map((file) => ({
  file,
  source: readFileSync(new URL(file, ROOT), "utf8"),
}));

const plotBlocks = sources.flatMap(({ file, source }) =>
  [...source.matchAll(/<NativePlotSvg\b[\s\S]*?<\/NativePlotSvg>/g)].map((match) => ({
    file,
    source: match[0],
  })),
);

function attributes(tag: string) {
  return Object.fromEntries(
    [...tag.matchAll(/([a-zA-Z][\w-]*)="([^"]*)"/g)].map((match) => [match[1], match[2]]),
  );
}

function number(value: string | undefined) {
  return value === undefined ? Number.NaN : Number(value);
}

test("all Chapter 1 coordinate diagrams use the shared precision plot", () => {
  assert.equal(plotBlocks.length, 14, "unexpected Chapter 1 coordinate-diagram count");
  const shared = readFileSync(new URL("src/components/native-lesson-diagram.tsx", ROOT), "utf8");
  assert.match(shared, /viewBox="0 0 400 250"/);
  assert.match(shared, /shapeRendering="geometricPrecision"/);
  assert.match(shared, /preserveAspectRatio="xMidYMid meet"/);
});

test("every coordinate plot is accessible and labels both axes", () => {
  for (const plot of plotBlocks) {
    const openingTag = plot.source.match(/<NativePlotSvg\b[\s\S]*?>/)?.[0] ?? "";
    assert.match(openingTag, /role="img"/, plot.file);
    assert.match(openingTag, /aria-label=/, plot.file);
    assert.match(plot.source, /<text\b[^>]*>[\s\S]*?(?:x|n)[\s\S]*?<\/text>/i, `${plot.file}: missing horizontal-axis label`);
    assert.match(plot.source, /<text\b[^>]*>[\s\S]*?(?:y|H)[\s\S]*?<\/text>/, `${plot.file}: missing vertical-axis label`);
  }
});

test("literal SVG labels do not intersect straight axes, guides or asymptotes", () => {
  for (const plot of plotBlocks) {
    const lines = [...plot.source.matchAll(/<line\b[^>]*\/>/g)].map((match) => attributes(match[0]));
    const labels = [...plot.source.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((match) => ({
      attrs: attributes(match[0]),
      text: match[1].trim(),
    }));

    for (const label of labels) {
      const x = number(label.attrs.x);
      const y = number(label.attrs.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      const width = Math.max(7, label.text.length * 7);
      const anchor = label.attrs.textAnchor ?? "start";
      const left = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
      const right = left + width;
      const top = y - 13;
      const bottom = y + 3;

      for (const line of lines) {
        const x1 = number(line.x1);
        const x2 = number(line.x2);
        const y1 = number(line.y1);
        const y2 = number(line.y2);
        const vertical = x1 === x2 && x1 >= left && x1 <= right
          && Math.max(Math.min(y1, y2), top) <= Math.min(Math.max(y1, y2), bottom);
        const horizontal = y1 === y2 && y1 >= top && y1 <= bottom
          && Math.max(Math.min(x1, x2), left) <= Math.min(Math.max(x1, x2), right);
        assert.ok(!vertical && !horizontal, `${plot.file}: “${label.text}” intersects a line`);
      }
    }
  }
});

test("smooth curves use curve commands and no coordinate plot uses a polyline", () => {
  for (const plot of plotBlocks) {
    assert.doesNotMatch(plot.source, /<polyline\b/, plot.file);
    const paths = [...plot.source.matchAll(/<path\b[^>]*\/>/g)].map((match) => attributes(match[0]));
    for (const path of paths) {
      const d = path.d ?? "";
      if (/[CQ]/.test(d)) {
        assert.ok(number(path.strokeWidth) >= 2, `${plot.file}: smooth curve is too light`);
      }
    }
  }
});

test("diagram sources contain no masking hacks or slash-form maths labels", () => {
  for (const { file, source } of sources) {
    assert.doesNotMatch(source, /stroke="white"|stroke="#fff(?:fff)?"/i, file);
    assert.doesNotMatch(source, /<text\b[^>]*>\s*-?\d+\s*\/\s*\d+\s*<\/text>/, file);
  }
});

test("the permanent guide records the collision, curve and release checks", () => {
  const guide = readFileSync(new URL("docs/notion-preview-diagram-style.md", ROOT), "utf8");
  for (const requirement of [
    "Protected label zones",
    "Curves and mathematical accuracy",
    "Coordinate axes",
    "320px, 430px and desktop",
    "npm run test:diagrams",
  ]) {
    assert.ok(guide.includes(requirement), `diagram guide is missing: ${requirement}`);
  }
});
