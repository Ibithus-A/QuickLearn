"use client";

import { THEME_STORAGE_KEY } from "@/lib/constants/storage";
import { usePersistedState } from "@/lib/hooks/use-persisted-state";
import { useEffect } from "react";

export function useTheme() {
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

  return { isDarkMode, setIsDarkMode };
}
