import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initial;
    } catch { return initial; }
  });

  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /**/ }
  }, [key, value]);

  const remove = useCallback(() => {
    try { window.localStorage.removeItem(key); setValue(initial); } catch { /**/ }
  }, [key, initial]);

  return [value, setValue, remove] as const;
}
