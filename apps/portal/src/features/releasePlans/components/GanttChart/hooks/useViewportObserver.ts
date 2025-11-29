import { useEffect, useState, useRef, useCallback } from "react";

export interface ViewportRange {
  startIndex: number;
  endIndex: number;
  startDate: Date;
  endDate: Date;
}

interface UseViewportObserverProps {
  containerRef: React.RefObject<HTMLDivElement>;
  pxPerDay: number;
  startDate: Date;
  totalDays: number;
  /**
   * Overscan: número de días extra a cargar fuera del viewport visible
   * Útil para scroll suave sin gaps de carga
   */
  overscan?: number;
  /**
   * Callback cuando cambia el viewport visible
   */
  onViewportChange?: (range: ViewportRange) => void;
}

/**
 * Hook para observar el viewport visible usando Intersection Observer
 * Solo carga/calcula datos para días visibles, mejorando rendimiento significativamente
 */
export function useViewportObserver({
  containerRef,
  pxPerDay,
  startDate,
  totalDays,
  overscan = 10,
  onViewportChange,
}: UseViewportObserverProps) {
  const [viewportRange, setViewportRange] = useState<ViewportRange | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const calculateViewportRange = useCallback(() => {
    const container = containerRef.current;
    if (!container) return null;

    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;

    // Calcular índices visibles
    const startIndex = Math.max(0, Math.floor(scrollLeft / pxPerDay) - overscan);
    const endIndex = Math.min(
      totalDays - 1,
      Math.ceil((scrollLeft + clientWidth) / pxPerDay) + overscan
    );

    // Calcular fechas correspondientes
    const startDateVisible = new Date(startDate);
    startDateVisible.setDate(startDateVisible.getDate() + startIndex);

    const endDateVisible = new Date(startDate);
    endDateVisible.setDate(endDateVisible.getDate() + endIndex);

    return {
      startIndex,
      endIndex,
      startDate: startDateVisible,
      endDate: endDateVisible,
    };
  }, [containerRef, pxPerDay, startDate, totalDays, overscan]);

  const updateViewport = useCallback(() => {
    const newRange = calculateViewportRange();
    if (!newRange) return;

    // Solo actualizar si cambió significativamente (evitar updates constantes)
    setViewportRange((prev) => {
      if (
        prev &&
        Math.abs(prev.startIndex - newRange.startIndex) < 5 &&
        Math.abs(prev.endIndex - newRange.endIndex) < 5
      ) {
        return prev; // No cambiar si la diferencia es pequeña
      }
      return newRange;
    });
  }, [calculateViewportRange]);

  // Throttle updates usando requestAnimationFrame
  const throttledUpdate = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      updateViewport();
      rafIdRef.current = null;
    });
  }, [updateViewport]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calcular viewport inicial
    updateViewport();

    // Observar cambios en scroll
    container.addEventListener("scroll", throttledUpdate, { passive: true });
    window.addEventListener("resize", throttledUpdate, { passive: true });

    return () => {
      container.removeEventListener("scroll", throttledUpdate);
      window.removeEventListener("resize", throttledUpdate);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [throttledUpdate, updateViewport, containerRef]);

  // Notificar cambios en viewport
  useEffect(() => {
    if (viewportRange && onViewportChange) {
      onViewportChange(viewportRange);
    }
  }, [viewportRange, onViewportChange]);

  return {
    viewportRange,
    isVisible: viewportRange !== null,
  };
}

