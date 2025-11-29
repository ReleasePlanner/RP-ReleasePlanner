import { useMemo } from "react";
import { addDays, daysBetween } from "../../../lib/date";

/**
 * Hook optimizado para calcular días del timeline
 * Calcula días bajo demanda en lugar de crear array completo
 */
export function useOptimizedDays(start: Date, end: Date) {
  const totalDays = useMemo(
    () => Math.max(1, daysBetween(start, end)),
    [start, end]
  );

  // ⚡ OPTIMIZATION: Lazy creation - solo calcula días cuando se necesitan
  // En lugar de crear array completo, proporcionamos funciones helper
  const getDayAtIndex = useMemo(
    () =>
      (index: number): Date => {
        if (index < 0 || index >= totalDays) {
          throw new Error(`Index ${index} out of range [0, ${totalDays})`);
        }
        return addDays(start, index);
      },
    [start, totalDays]
  );

  const getDayIndex = useMemo(
    () =>
      (date: Date): number => {
        const diff = Math.floor(
          (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        return Math.max(0, Math.min(totalDays - 1, diff));
      },
    [start, totalDays]
  );

  const getDateKey = useMemo(
    () =>
      (index: number): string => {
        return getDayAtIndex(index).toISOString().slice(0, 10);
      },
    [getDayAtIndex]
  );

  // Para compatibilidad con código existente, aún proporcionamos array
  // pero solo se crea cuando es necesario
  const daysArray = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(start, i)),
    [start, totalDays]
  );

  return {
    totalDays,
    days: daysArray, // Para compatibilidad
    getDayAtIndex,
    getDayIndex,
    getDateKey,
  };
}

/**
 * Hook para calcular índices de weekends de forma eficiente
 * Solo calcula índices, no crea elementos DOM
 */
export function useWeekendIndices(start: Date, totalDays: number) {
  return useMemo(() => {
    const weekendIndices: number[] = [];
    for (let i = 0; i < totalDays; i++) {
      const day = addDays(start, i);
      const dow = day.getDay();
      if (dow === 0 || dow === 6) {
        weekendIndices.push(i);
      }
    }
    return weekendIndices;
  }, [start, totalDays]);
}
