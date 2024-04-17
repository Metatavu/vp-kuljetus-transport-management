import { useState, useEffect } from "react";

export const useDebounce = <T>(initialValue: T, delay?: number): [ T, T, React.Dispatch<React.SetStateAction<T>> ] => {
  const [ value, setValue ] = useState(initialValue);
  const [ debouncedValue, setDebouncedValue ] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => { clearTimeout(timeout); };
  }, [ value, delay ]);

  return [ debouncedValue, value, setValue ];
};