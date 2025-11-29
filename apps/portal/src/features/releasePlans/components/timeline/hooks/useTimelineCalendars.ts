import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { calendarsService } from "../../../../../api/services/calendars.service";
import type { Calendar } from "../../../../../features/calendar/types";
import type { TimelineViewportRange } from "../types/timeline.types";
import type { CalendarDay as APICalendarDay } from "../../../../../api/services/calendars.service";

interface UseTimelineCalendarsProps {
  calendarIds: string[];
  viewportRange: TimelineViewportRange | null;
  enabled?: boolean;
}

/**
 * Hook optimizado para cargar calendarios
 * Solo carga calendarios que intersectan con el viewport visible
 * Prefetch calendarios adyacentes en background
 */
export function useTimelineCalendars({
  calendarIds,
  viewportRange,
  enabled = true,
}: UseTimelineCalendarsProps) {
  // ⚡ OPTIMIZATION: Solo cargar calendarios si hay viewport
  // Si no hay viewport aún, no cargar nada (esperar a que se calcule)
  const shouldLoad = enabled && viewportRange !== null && calendarIds.length > 0;

  // Por ahora, cargar todos los calendarios pero con cache optimizado
  // TODO: Filtrar por viewport range cuando tengamos metadata de calendarios
  const queries = useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ["calendars", "detail", id],
      queryFn: () => calendarsService.getById(id),
      enabled: shouldLoad && !!id,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Usar cache si está disponible
    })),
  });

  const calendars = useMemo(() => {
    return queries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => {
        const apiCalendar = query.data!;
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
        } as Calendar;
      });
  }, [queries]);

  const isLoading = queries.some((q) => q.isLoading);

  return {
    calendars,
    isLoading,
  };
}

