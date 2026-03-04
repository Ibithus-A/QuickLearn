"use client";

import { THEME_STORAGE_KEY } from "@/lib/constants/storage";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

function withoutThemeTransitions(run: () => void) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  run();
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      root.classList.remove("theme-switching");
    });
  });
}

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeHydrated, setIsThemeHydrated] = useState(false);

  useEffect(() => {
    try {
      const persisted = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (persisted === "dark") {
        setIsDarkMode(true);
      }
    } finally {
      setIsThemeHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isThemeHydrated) return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
    } catch {
      // Ignore quota/private mode failures.
    }
  }, [isDarkMode, isThemeHydrated]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  const setThemeMode = useCallback<Dispatch<SetStateAction<boolean>>>((value) => {
    setIsDarkMode((previous) => {
      const next = typeof value === "function" ? value(previous) : value;
      if (next === previous) return previous;

      withoutThemeTransitions(() => {});
      return next;
    });
  }, []);

  return { isDarkMode, setIsDarkMode: setThemeMode };
}
