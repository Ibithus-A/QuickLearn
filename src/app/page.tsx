"use client";

import { FlowLogoIcon } from "@/components/icons";
import { EditorPane } from "@/components/editor-pane";
import { SignInPortal } from "@/components/sign-in-portal";
import { Sidebar } from "@/components/sidebar";
import { FlowStateProvider } from "@/context/flowstate-context";
import { usePersistedState } from "@/lib/hooks/use-persisted-state";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useState } from "react";

const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_MAX_WIDTH = 520;
const SIDEBAR_DEFAULT_WIDTH = 290;
const THEME_STORAGE_KEY = "quicklearn:theme";
const SIDEBAR_WIDTH_STORAGE_KEY = "quicklearn:sidebar-width";

export default function HomePage() {
  const [isSignInPortalOpen, setIsSignInPortalOpen] = useState(false);
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
  const [isDarkMode, setIsDarkMode] = usePersistedState<boolean>({
    key: THEME_STORAGE_KEY,
    defaultValue: false,
    serialize: (value) => (value ? "dark" : "light"),
    deserialize: (raw) => raw === "dark",
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

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

  return (
    <FlowStateProvider>
      <main className={`h-screen w-screen bg-[var(--surface-app)] ${isDarkMode ? "theme-dark" : ""}`}>
        <div className="relative h-full w-full overflow-hidden bg-[var(--surface-panel)]">
          {isSignInPortalOpen && (
            <SignInPortal
              onClose={() => setIsSignInPortalOpen(false)}
              onContinue={() => setIsSignInPortalOpen(false)}
            />
          )}

          <button
            type="button"
            onClick={() => setIsSignInPortalOpen(true)}
            className="absolute left-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white/95 text-zinc-700 shadow-sm hover:bg-zinc-50"
            aria-label="Open sign in portal"
            title="Open sign in portal"
          >
            <FlowLogoIcon className="h-5 w-5" />
          </button>

          <div className="group/sidebar absolute inset-y-0 left-0 z-30 w-2">
            <aside
              id="flowstate-sidebar"
              className="absolute inset-y-0 left-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/sidebar:translate-x-0"
              style={{ width: `${sidebarWidth}px` }}
            >
              <Sidebar />
              <div
                className="absolute inset-y-0 right-0 hidden w-2 cursor-col-resize lg:block"
                onMouseDown={startResize}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize sidebar"
              />
            </aside>
          </div>

          <div className="h-full">
            <EditorPane
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((value) => !value)}
            />
          </div>
        </div>
      </main>
    </FlowStateProvider>
  );
}
