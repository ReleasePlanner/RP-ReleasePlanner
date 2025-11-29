import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { calendarsService } from "../../../../../api/services/calendars.service";
import type { CalendarDay } from "../../../../../features/calendar/types";
import type { CalendarDay as APICalendarDay } from "../../../../../api/services/calendars.service";

/**
 * Hook optimizado para cargar calendarios
 * Solo carga cuando hay calendarIds y usa cache agresivo
 */
export function useOptimizedCalendars(calendarIds: string[], enabled = true) {
  // ⚡ OPTIMIZATION: Solo cargar si hay IDs y está habilitado
  const shouldLoad = enabled && calendarIds.length > 0;

  const calendarQueries = useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ["calendars", "detail", id],
      queryFn: () => calendarsService.getById(id),
      enabled: shouldLoad && !!id,
      staleTime: 10 * 60 * 1000, // 10 minutos (aumentado de 5)
      gcTime: 30 * 60 * 1000, // 30 minutos (aumentado de 10)
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Usar cache si está disponible
      refetchOnReconnect: false,
    })),
  });

  // Convert API calendars to local format
  const planCalendars = useMemo(() => {
    if (!shouldLoad) return [];

    return calendarQueries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => {
        const apiCalendar = query.data;
        if (!apiCalendar) {
          return null;
        }
        return {
          id: apiCalendar.id,
          name: apiCalendar.name,
          description: apiCalendar.description,
          days:
            apiCalendar.days?.map((day: APICalendarDay) => ({
              id: day.id,
              name: day.name,
              date: day.date,
              type: day.type,
              description: day.description,
              recurring: day.recurring,
              createdAt: day.createdAt,
              updatedAt: day.updatedAt,
            })) || [],
        };
      })
      .filter((cal): cal is NonNullable<typeof cal> => cal !== null);
  }, [calendarQueries, shouldLoad]);

  const isLoading = calendarQueries.some((q) => q.isLoading);

  return {
    planCalendars,
    isLoading,
  };
}

// ⚡ OPTIMIZATION: useOptimizedCalendarDaysMap moved to separate file
// with Web Worker support - see useOptimizedCalendarDaysMap.ts
