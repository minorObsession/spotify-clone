import { useEffect, useState } from "react";

export function useInputChangeDebounce<T>(valueToChange, delay = 500) {
  // ! create variable to manipulate
  const [debouncedValue, setDebouncedValue] = useState();

  // ! useEffect to change
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(valueToChange);
    }, delay);

    return () => clearTimeout(timeout);
  }, [valueToChange, delay]);

  return debouncedValue;
}
