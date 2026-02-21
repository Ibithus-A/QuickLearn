"use client";

import { FolderIcon, PlusIcon } from "@/components/icons";
import { SidebarNode } from "@/components/sidebar-node";
import { useFlowState } from "@/context/flowstate-context";
import type { DragEvent } from "react";

export function Sidebar() {
  const { state, addNode, moveNode, isHydrated } = useFlowState();

  const handleRootDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("application/x-flowstate-node-id");
    if (!draggedId) return;
    moveNode(draggedId, { type: "root" });
  };

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-zinc-200 bg-[var(--surface-sidebar)]">
      <div className="border-b border-zinc-200 px-3 py-3.5">
        <div className="flex h-8 items-center gap-3 pl-11">
          <div className="flex items-center gap-1.5">
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
          </div>

          <p className="flex h-8 items-center text-[17px] font-semibold leading-none tracking-tight text-zinc-900">
            QuickLearn
          </p>
        </div>
      </div>

      <div
        className="scroll-slim min-h-0 flex-1 overflow-y-auto px-2 py-2"
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
        onDrop={handleRootDrop}
      >
        {state.rootIds.length === 0 ? (
          <div className="mx-2 mt-2 rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-center">
            <p className="text-sm font-medium text-zinc-700">Your workspace is empty</p>
            <p className="mt-1 text-xs text-zinc-500">
              Create a page or folder to get started.
            </p>
          </div>
        ) : (
          state.rootIds.map((nodeId) => (
            <SidebarNode key={nodeId} nodeId={nodeId} depth={0} />
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
