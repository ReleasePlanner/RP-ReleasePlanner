import { useRef, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { addDays, daysBetween } from "../../../../../lib/date";
import type { TimelineViewportRange } from "../../types/timeline.types";

export interface TimelineViewportProps {
  startDate: Date;
  endDate: Date;
  pxPerDay: number;
  children: (visibleRange: TimelineViewportRange) => React.ReactNode;
  onViewportChange?: (range: TimelineViewportRange) => void;
}

/**
 * Componente de viewport virtualizado para el timeline
 * Solo renderiza días visibles en el viewport, reduciendo memoria y tiempo de render
 */
export function TimelineViewport({
  startDate,
  endDate,
  pxPerDay,
  children,
  onViewportChange,
}: TimelineViewportProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const totalDays = useMemo(
    () => Math.max(1, daysBetween(startDate, endDate)),
    [startDate, endDate]
  );

  const virtualizer = useVirtualizer({
    count: totalDays,
    getScrollElement: () => parentRef.current,
    estimateSize: () => pxPerDay,
    overscan: 10, // Render 10 días extra fuera del viewport para scroll suave
  });

  // Calcular rango visible
  const virtualItemsForRange = virtualizer.getVirtualItems();
  const visibleRange = useMemo(() => {
    if (virtualItemsForRange.length === 0) {
      return null;
    }

    const firstItem = virtualItemsForRange[0];
    const lastItem = virtualItemsForRange[virtualItemsForRange.length - 1];

    return {
      start: addDays(startDate, firstItem.index),
      end: addDays(startDate, lastItem.index + 1),
      startIndex: firstItem.index,
      endIndex: lastItem.index + 1,
      totalDays: lastItem.index - firstItem.index + 1,
    } as TimelineViewportRange;
  }, [virtualItemsForRange, startDate]);

  // Notificar cambios en el viewport
  useEffect(() => {
    if (visibleRange && onViewportChange) {
      onViewportChange(visibleRange);
    }
  }, [visibleRange, onViewportChange]);

  // Calcular días visibles para pasar a children
  const virtualItems = virtualizer.getVirtualItems();
  const visibleDays = useMemo(() => {
    return virtualItems.map((item) => ({
      index: item.index,
      date: addDays(startDate, item.index),
      start: item.start,
      size: item.size,
    }));
  }, [virtualItems, startDate]);

  return (
    <div
      ref={parentRef}
      style={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {visibleRange && children(visibleRange)}
      </div>
    </div>
  );
}

