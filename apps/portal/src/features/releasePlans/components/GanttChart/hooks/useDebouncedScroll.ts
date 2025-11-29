import { useRef, useCallback } from "react";

/**
 * Hook para debounce/throttle de scroll events
 * Útil para optimizar operaciones pesadas durante scroll
 */
export function useDebouncedScroll<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 100
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      // Si pasó suficiente tiempo desde la última llamada, ejecutar inmediatamente
      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);
        return;
      }

      // Si no, programar para después
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
        timeoutRef.current = null;
      }, delay - timeSinceLastCall);
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook para throttle de scroll events usando requestAnimationFrame
 * Más eficiente que setTimeout para operaciones relacionadas con renderizado
 */
export function useThrottledScroll<T extends (...args: any[]) => void>(
  callback: T,
  fps: number = 30
): T {
  const rafIdRef = useRef<number | null>(null);
  const lastCallRef = useRef<number>(0);
  const frameInterval = 1000 / fps;

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= frameInterval) {
        // Ejecutar inmediatamente si pasó suficiente tiempo
        lastCallRef.current = now;
        callback(...args);
        return;
      }

      // Cancelar RAF pendiente si existe
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Programar para el siguiente frame disponible
      rafIdRef.current = requestAnimationFrame(() => {
        lastCallRef.current = Date.now();
        callback(...args);
        rafIdRef.current = null;
      });
    }) as T,
    [callback, frameInterval]
  );
}

