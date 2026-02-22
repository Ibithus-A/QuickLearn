"use client";

import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from "@/lib/constants/layout";
import { SIDEBAR_WIDTH_STORAGE_KEY } from "@/lib/constants/storage";
import { usePersistedState } from "@/lib/hooks/use-persisted-state";
import type { MouseEvent as ReactMouseEvent } from "react";

export function useSidebarResize() {
  const [sidebarWidth, setSidebarWidth] = usePersistedState<number>({
    key: SIDEBAR_WIDTH_STORAGE_KEY,
    defaultValue: SIDEBAR_DEFAULT_WIDTH,
    serialize: (value) => String(value),
    deserialize: (raw) => {
      const value = Number(raw);
      if (!Number.isFinite(value)) return SIDEBAR_DEFAULT_WIDTH;
      return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, value));
    },
  });

  const startResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = sidebarWidth;

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(SIDEBAR_MIN_WIDTH, startWidth + delta),
      );
      setSidebarWidth(nextWidth);
    };

    const stopResize = () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
  };

  return { sidebarWidth, startResize };
}
