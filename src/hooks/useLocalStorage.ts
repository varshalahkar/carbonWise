import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallback: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;

    try {
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
