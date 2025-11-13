import { useState, useEffect } from "react";

/**
 * Hook para debounce de valores
 * Útil para optimizar búsquedas y evitar peticiones excesivas
 * 
 * @param {any} value - El valor a debounce
 * @param {number} delay - El delay en milisegundos (default: 500)
 * @returns {any} - El valor debounced
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

