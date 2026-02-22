"use client";

import { FlowLogoIcon, FolderIcon, PlusIcon } from "@/components/icons";
import { SidebarNode } from "@/components/sidebar-node";
import { useFlowState } from "@/context/flowstate-context";
import { A_LEVEL_MATHS_TITLE } from "@/lib/seed";
import type { DragEvent } from "react";
import { useEffect, useMemo } from "react";

type SidebarProps = {
  onOpenDashboard?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  role?: "tutor" | "student";
  unlockedChapterTitles?: string[];
};

function collectSubtreeIds(
  nodes: ReturnType<typeof useFlowState>["state"]["nodes"],
  id: string,
  visibleIds: Set<string>,
) {
  const node = nodes[id];
  if (!node || visibleIds.has(id)) return;

  visibleIds.add(id);
  for (const childId of node.childrenIds) {
    collectSubtreeIds(nodes, childId, visibleIds);
  }
}

export function Sidebar({
  onOpenDashboard,
  isDarkMode = false,
  onToggleDarkMode,
  role = "tutor",
  unlockedChapterTitles = [],
}: SidebarProps) {
  const { state, addNode, moveNode, isHydrated, selectNode } = useFlowState();
  const isStudent = role === "student";
  const canManage = !isStudent;

  const { visibleRootIds, visibleNodeIds } = useMemo(() => {
    if (!isStudent) {
      const allVisible = new Set<string>();
      for (const id of Object.keys(state.nodes)) {
        allVisible.add(id);
      }
      return { visibleRootIds: state.rootIds, visibleNodeIds: allVisible };
    }

    const visibleIds = new Set<string>();
    const unlocked = new Set(unlockedChapterTitles.map((title) => title.toLowerCase()));
    const mathRootId = state.rootIds.find((id) => {
      const title = state.nodes[id]?.title?.trim().toLowerCase();
      return title === A_LEVEL_MATHS_TITLE.toLowerCase();
    });

    if (!mathRootId) {
      return { visibleRootIds: [], visibleNodeIds: visibleIds };
    }

    visibleIds.add(mathRootId);
    const chapters = state.nodes[mathRootId]?.childrenIds ?? [];
    for (const chapterId of chapters) {
      const chapterTitle = state.nodes[chapterId]?.title?.toLowerCase();
      if (!chapterTitle || !unlocked.has(chapterTitle)) continue;
      collectSubtreeIds(state.nodes, chapterId, visibleIds);
    }

    return { visibleRootIds: [mathRootId], visibleNodeIds: visibleIds };
  }, [isStudent, state.nodes, state.rootIds, unlockedChapterTitles]);

  useEffect(() => {
    if (!isStudent) return;
    if (!state.selectedId) {
      if (visibleRootIds[0]) selectNode(visibleRootIds[0]);
      return;
    }
    if (!visibleNodeIds.has(state.selectedId) && visibleRootIds[0]) {
      selectNode(visibleRootIds[0]);
    }
  }, [isStudent, selectNode, state.selectedId, visibleNodeIds, visibleRootIds]);

  const handleRootDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!canManage) return;
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("application/x-flowstate-node-id");
    if (!draggedId) return;
    moveNode(draggedId, { type: "root" });
  };

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-zinc-200 bg-[var(--surface-sidebar)]">
      <div className="border-b border-zinc-200 px-3 py-3">
        <div className="flex h-9 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white">
              <FlowLogoIcon className="h-4 w-4" />
            </div>
            <p className="truncate text-[16px] font-semibold leading-none tracking-tight text-zinc-900">
              QuickLearn
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {canManage ? (
              <>
                <button
                  type="button"
                  onClick={() => addNode("page", null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
                  aria-label="New page"
                  title="New page"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => addNode("folder", null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
                  aria-label="New folder"
                  title="New folder"
                >
                  <FolderIcon className="h-3.5 w-3.5" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="scroll-slim min-h-0 flex-1 overflow-y-auto px-2 py-2"
        onDragOver={(event) => {
          if (!canManage) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
        onDrop={handleRootDrop}
      >
        {onOpenDashboard ? (
          <button
            type="button"
            onClick={onOpenDashboard}
            className="mx-2 mb-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            <span>Dashboard</span>
            <span className="text-xs text-zinc-500">Open</span>
          </button>
        ) : null}

        {onToggleDarkMode ? (
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="mx-2 mb-3 flex w-[calc(100%-1rem)] items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            <span>Dark Mode</span>
            <span className="text-xs text-zinc-500">{isDarkMode ? "On" : "Off"}</span>
          </button>
        ) : null}

        {visibleRootIds.length === 0 ? (
          <div className="mx-2 mt-2 rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-center">
            <p className="text-sm font-medium text-zinc-700">Your workspace is empty</p>
            <p className="mt-1 text-xs text-zinc-500">
              Create a page or folder to get started.
            </p>
          </div>
        ) : (
          visibleRootIds.map((nodeId) => (
            <SidebarNode
              key={nodeId}
              nodeId={nodeId}
              depth={0}
              canManage={canManage}
              canViewNode={(id) => visibleNodeIds.has(id)}
            />
          ))
        )}
      </div>

      <div className="border-t border-zinc-200 px-3 py-3">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{isHydrated ? "Autosaved locally" : "Loading..."}</span>
          <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5">
            Offline-first
          </span>
        </div>
      </div>
    </aside>
  );
}
