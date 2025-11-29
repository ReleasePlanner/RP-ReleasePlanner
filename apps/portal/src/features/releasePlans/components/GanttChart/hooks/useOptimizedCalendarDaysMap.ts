import { useMemo } from "react";
import type { CalendarDay } from "../../../../../features/calendar/types";
import { useCalendarWorker } from "./useCalendarWorker";

/**
 * Hook optimizado para crear calendarDaysMap
 * Usa Web Worker para cálculos pesados si es necesario
 * Solo procesa días visibles en el viewport si es posible
 */
export function useOptimizedCalendarDaysMap(
  planCalendars: Array<{
    id: string;
    name: string;
    days: CalendarDay[];
  }>,
  start: Date,
  end: Date,
  viewportStart?: number,
  viewportEnd?: number
) {
  // ⚡ OPTIMIZATION: Usar Web Worker para cálculos pesados
  const { calendarDaysMap: workerMap, isProcessing, usingWorker } =
    useCalendarWorker({
      calendars: planCalendars,
      startDate: start,
      endDate: end,
      viewportStart,
      viewportEnd,
      enabled: planCalendars.length > 0,
    });

  // Fallback: cálculo directo si no se usa worker o está procesando
  const directMap = useMemo(() => {
    // Si usa worker y ya terminó, retornar el mapa del worker
    if (usingWorker && !isProcessing && workerMap.size > 0) {
      return workerMap;
    }

    // Si está usando worker y aún procesando, calcular directamente como fallback
    // Esto asegura que siempre tengamos datos mientras el worker procesa

    // Cálculo directo para casos pequeños (más rápido que worker overhead)
    const map = new Map<string, Array<{ day: CalendarDay; calendarName: string }>>();
    const shouldLimitToViewport =
      viewportStart !== undefined && viewportEnd !== undefined;

    for (const calendar of planCalendars) {
      for (const day of calendar.days) {
        const dateKey = day.date;

        if (day.recurring) {
          const dayDate = new Date(day.date);
          const dayMonth = dayDate.getMonth();
          const dayDay = dayDate.getDate();

          const startYear = start.getFullYear();
          const endYear = end.getFullYear();

          for (let year = startYear; year <= endYear; year++) {
            const recurringDate = new Date(year, dayMonth, dayDay);

            if (
              shouldLimitToViewport &&
              viewportStart !== undefined &&
              viewportEnd !== undefined
            ) {
              const dayIndex = Math.floor(
                (recurringDate.getTime() - start.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              if (dayIndex < viewportStart || dayIndex > viewportEnd) {
                continue;
              }
            }

            if (recurringDate >= start && recurringDate <= end) {
              const recurringDateKey = recurringDate.toISOString().slice(0, 10);
              const existing = map.get(recurringDateKey);
              if (existing) {
                existing.push({
                  day,
                  calendarName: calendar.name,
                });
              } else {
                map.set(recurringDateKey, [
                  {
                    day,
                    calendarName: calendar.name,
                  },
                ]);
              }
            }
          }
        } else {
          const dayDate = new Date(day.date);

          if (
            shouldLimitToViewport &&
            viewportStart !== undefined &&
            viewportEnd !== undefined
          ) {
            const dayIndex = Math.floor(
              (dayDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (dayIndex < viewportStart || dayIndex > viewportEnd) {
              continue;
            }
          }

          if (dayDate >= start && dayDate <= end) {
            const existing = map.get(dateKey);
            if (existing) {
              existing.push({
                day,
                calendarName: calendar.name,
              });
            } else {
              map.set(dateKey, [
                {
                  day,
                  calendarName: calendar.name,
                },
              ]);
            }
          }
        }
      }
    }

    return map;
  }, [
    planCalendars,
    start,
    end,
    viewportStart,
    viewportEnd,
    usingWorker,
    isProcessing,
    workerMap,
  ]);

  return directMap;
}

