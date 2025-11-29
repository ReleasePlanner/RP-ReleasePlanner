import { memo, useMemo } from "react";
import { addDays } from "../../../../lib/date";

export interface OptimizedWeekendGridProps {
  start: Date;
  totalDays: number;
  pxPerDay: number;
  weekendIndices: number[];
  backgroundColor: string;
}

/**
 * Componente optimizado para renderizar solo weekends
 * En lugar de iterar sobre todos los días, solo renderiza los que son weekends
 */
export const OptimizedWeekendGrid = memo(function OptimizedWeekendGrid({
  start,
  totalDays,
  pxPerDay,
  weekendIndices,
  backgroundColor,
}: OptimizedWeekendGridProps) {
  // Agrupar weekends consecutivos para reducir número de elementos DOM
  const weekendRanges = useMemo(() => {
    if (weekendIndices.length === 0) return [];

    const ranges: Array<{ startIdx: number; endIdx: number }> = [];
    let currentRange: { startIdx: number; endIdx: number } | null = null;

    for (const idx of weekendIndices) {
      if (currentRange === null) {
        currentRange = { startIdx: idx, endIdx: idx };
      } else if (idx === currentRange.endIdx + 1) {
        // Consecutivo, extender rango
        currentRange.endIdx = idx;
      } else {
        // No consecutivo, guardar rango anterior y empezar nuevo
        ranges.push(currentRange);
        currentRange = { startIdx: idx, endIdx: idx };
      }
    }

    if (currentRange !== null) {
      ranges.push(currentRange);
    }

    return ranges;
  }, [weekendIndices]);

  return (
    <>
      {weekendRanges.map((range, idx) => {
        const left = range.startIdx * pxPerDay;
        const width = (range.endIdx - range.startIdx + 1) * pxPerDay;

        return (
          <div
            key={`weekend-${range.startIdx}-${range.endIdx}`}
            className="absolute top-0 pointer-events-none z-0"
            style={{
              left,
              width,
              height: "100%",
              backgroundColor,
            }}
          />
        );
      })}
    </>
  );
});
