"use client";

import { useEffect, useRef, useState } from "react";

const PERSISTED_STATE_SYNC_EVENT = "excelora:persisted-state-sync";

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
  const serializeRef = useRef(serialize);
  const deserializeRef = useRef(deserialize);
  const lastRawRef = useRef<string | null>(null);

  useEffect(() => {
    serializeRef.current = serialize;
  }, [serialize]);

  useEffect(() => {
    deserializeRef.current = deserialize;
  }, [deserialize]);

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
      const raw = serializeRef.current(value);
      if (raw === lastRawRef.current) return;
      lastRawRef.current = raw;
      window.localStorage.setItem(key, raw);
      window.dispatchEvent(
        new CustomEvent(PERSISTED_STATE_SYNC_EVENT, {
          detail: { key, raw },
        }),
      );
    } catch {
      // Ignore quota/private mode failures.
    }
  }, [key, value]);

  useEffect(() => {
    const handleSync = (event: Event) => {
      const syncEvent = event as CustomEvent<{ key?: unknown; raw?: unknown }>;
      if (syncEvent.detail?.key !== key) return;
      if (typeof syncEvent.detail.raw !== "string") return;
      if (syncEvent.detail.raw === lastRawRef.current) return;

      try {
        lastRawRef.current = syncEvent.detail.raw;
        setValue(deserializeRef.current(syncEvent.detail.raw));
      } catch {
        // Ignore malformed sync payloads.
      }
    };

    window.addEventListener(PERSISTED_STATE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(PERSISTED_STATE_SYNC_EVENT, handleSync);
  }, [key]);

  return [value, setValue] as const;
}
