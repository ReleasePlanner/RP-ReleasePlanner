import { useEffect, useRef, useCallback } from "react";
import { safeScrollToX } from "../../../../../utils/dom";

interface UseOptimizedScrollProps {
  containerRef: React.RefObject<HTMLDivElement>;
  start: Date;
  end: Date;
  pxPerDay: number;
  totalDays: number;
  enabled?: boolean;
}

/**
 * Hook optimizado para scroll automático a "hoy"
 * Usa requestAnimationFrame para mejor sincronización y menos bloqueo
 */
export function useOptimizedScroll({
  containerRef,
  start,
  end,
  pxPerDay,
  totalDays,
  enabled = true,
}: UseOptimizedScrollProps) {
  const hasScrolledRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const scrollToToday = useCallback(() => {
    const el = containerRef.current;
    if (!el || !enabled || hasScrolledRef.current) return;

    // ⚡ OPTIMIZATION: Use requestAnimationFrame for better synchronization
    // This ensures scroll happens after browser paint, reducing jank
    const performScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let index: number;
      if (today <= start) {
        index = 0;
      } else if (today >= end) {
        index = Math.max(0, totalDays - 1);
      } else {
        index = Math.max(
          0,
          Math.min(
            totalDays - 1,
            Math.floor(
              (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            )
          )
        );
      }

      const visibleWidth = Math.max(0, el.clientWidth);
      const target = index * pxPerDay - visibleWidth / 2;
      const left = Math.max(0, target);

      // ⚡ OPTIMIZATION: Use 'auto' for instant scroll on initial load
      // User can manually scroll after if needed
      safeScrollToX(el, left, "auto");
      hasScrolledRef.current = true;
    };

    // Cancel any pending scroll
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Schedule scroll for next frame
    rafIdRef.current = requestAnimationFrame(() => {
      // Double RAF for better timing (after layout and paint)
      requestAnimationFrame(performScroll);
    });
  }, [containerRef, start, end, pxPerDay, totalDays, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Reset scroll flag when dates change
    hasScrolledRef.current = false;

    // Small delay to ensure container is rendered
    const timeoutId = setTimeout(() => {
      scrollToToday();
    }, 50); // Reduced from 100ms for faster initial scroll

    return () => {
      clearTimeout(timeoutId);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [scrollToToday, enabled]);

  return {
    scrollToToday,
  };
}
