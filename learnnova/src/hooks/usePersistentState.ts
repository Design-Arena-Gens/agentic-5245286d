"use client";

import { useCallback, useEffect, useState } from "react";

export function usePersistentState<T>(key: string, defaultValue: T) {
  const isBrowser = typeof window !== "undefined";
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(!isBrowser);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored) as T);
      }
    } catch (error) {
      console.error("Failed to load localStorage key", key, error);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to persist localStorage key", key, error);
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => {
    setValue(defaultValue);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }, [defaultValue, key]);

  return { value, setValue, hydrated, reset } as const;
}
