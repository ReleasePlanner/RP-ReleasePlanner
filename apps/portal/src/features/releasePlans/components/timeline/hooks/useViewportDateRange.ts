import { useMemo, useEffect, useState, useRef } from "react";
import { daysBetween, addDays } from "../../../../lib/date";
import type { TimelineViewportRange } from "../types/timeline.types";

interface UseViewportDateRangeProps {
  containerRef: React.RefObject<HTMLDivElement>;
  startDate: Date;
  endDate: Date;
  pxPerDay: number;
}

/**
 * Hook para calcular el rango de fechas visible en el viewport
 * Optimizado para solo calcular días visibles, no todos los días
 */
export function useViewportDateRange({
  containerRef,
  startDate,
  endDate,
  pxPerDay,
}: UseViewportDateRangeProps): TimelineViewportRange {
  const [viewportStart, setViewportStart] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Calcular rango visible basado en scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateViewport = () => {
      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;

      // Calcular índices de días visibles
      const startIndex = Math.max(0, Math.floor(scrollLeft / pxPerDay));
      const endIndex = Math.min(
        Math.ceil((scrollLeft + clientWidth) / pxPerDay),
        daysBetween(startDate, endDate)
      );

      setViewportStart(startIndex);
      setViewportWidth(endIndex - startIndex);
    };

    updateViewport();
    container.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);

    return () => {
      container.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [containerRef, startDate, endDate, pxPerDay]);

  const totalDays = daysBetween(startDate, endDate);
  const visibleStartIndex = Math.max(0, viewportStart - 10); // Overscan
  const visibleEndIndex = Math.min(
    totalDays,
    viewportStart + viewportWidth + 10 // Overscan
  );

  return useMemo(
    () => ({
      start: addDays(startDate, visibleStartIndex),
      end: addDays(startDate, visibleEndIndex),
      startIndex: visibleStartIndex,
      endIndex: visibleEndIndex,
      totalDays: visibleEndIndex - visibleStartIndex,
    }),
    [startDate, visibleStartIndex, visibleEndIndex]
  );
}

