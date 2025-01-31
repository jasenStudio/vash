import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedValue !== value) {
        setDebouncedValue(value);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, debouncedValue]);

  return debouncedValue;
};
