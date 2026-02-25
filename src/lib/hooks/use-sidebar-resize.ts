"use client";

import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from "@/lib/constants/layout";
import { SIDEBAR_WIDTH_STORAGE_KEY } from "@/lib/constants/storage";
import { usePersistedState } from "@/lib/hooks/use-persisted-state";
import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

function getViewportSidebarMaxWidth() {
  if (typeof window === "undefined") return SIDEBAR_MAX_WIDTH;
  return Math.max(
    SIDEBAR_MIN_WIDTH,
    Math.min(SIDEBAR_MAX_WIDTH, window.innerWidth - 72),
  );
}

function clampSidebarWidth(value: number) {
  return Math.max(SIDEBAR_MIN_WIDTH, Math.min(getViewportSidebarMaxWidth(), value));
}

export function useSidebarResize() {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = usePersistedState<number>({
    key: SIDEBAR_WIDTH_STORAGE_KEY,
    defaultValue: SIDEBAR_DEFAULT_WIDTH,
    serialize: (value) => String(value),
    deserialize: (raw) => {
      const value = Number(raw);
      if (!Number.isFinite(value)) return SIDEBAR_DEFAULT_WIDTH;
      return clampSidebarWidth(value);
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth((current) => clampSidebarWidth(current));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setSidebarWidth]);

  const startResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = sidebarWidth;
    setIsResizing(true);

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = clampSidebarWidth(startWidth + delta);
      setSidebarWidth(nextWidth);
    };

    const stopResize = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
  };

  return { sidebarWidth, startResize, isResizing };
}
