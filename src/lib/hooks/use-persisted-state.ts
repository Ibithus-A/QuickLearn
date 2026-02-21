"use client";

import { useEffect, useState } from "react";

type UsePersistedStateOptions<T> = {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
};

export function usePersistedState<T>({
  key,
  defaultValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse as (raw: string) => T,
}: UsePersistedStateOptions<T>) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return deserialize(raw);
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {
      // Ignore quota/private mode failures.
    }
  }, [key, serialize, value]);

  return [value, setValue] as const;
}
