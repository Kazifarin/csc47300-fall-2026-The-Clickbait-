import { useState } from "react";
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
      return validate(stored) ? stored : fallback;
    } catch {
      return fallback;
    }
  });
  const [error, setError] = useState(false);
  function update(next: T) {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setError(false);
    } catch {
      setError(true);
    }
  }
  return [value, update, error] as const;
}
