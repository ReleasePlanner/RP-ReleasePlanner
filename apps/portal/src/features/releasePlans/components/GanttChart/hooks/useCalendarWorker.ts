import { useEffect, useState, useRef, useMemo } from "react";
import type { CalendarDay } from "../../../../../features/calendar/types";

interface Calendar {
  id: string;
  name: string;
  days: CalendarDay[];
}

interface UseCalendarWorkerProps {
  calendars: Calendar[];
  startDate: Date;
  endDate: Date;
  viewportStart?: number;
  viewportEnd?: number;
  enabled?: boolean;
}

/**
 * Hook para procesar calendarios usando Web Worker
 * Evita bloquear el UI thread durante cálculos pesados
 */
export function useCalendarWorker({
  calendars,
  startDate,
  endDate,
  viewportStart,
  viewportEnd,
  enabled = true,
}: UseCalendarWorkerProps) {
  const [calendarDaysMap, setCalendarDaysMap] = useState<
    Map<string, Array<{ day: CalendarDay; calendarName: string }>>
  >(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // ⚡ OPTIMIZATION: Solo usar worker si hay muchos calendarios o días
  // Para casos pequeños, el cálculo directo es más rápido (overhead del worker)
  const shouldUseWorker = useMemo(() => {
    if (!enabled || calendars.length === 0) return false;
    
    const totalDays = calendars.reduce((sum, cal) => sum + cal.days.length, 0);
    // Usar worker si hay más de 100 días de calendario o más de 3 calendarios
    return totalDays > 100 || calendars.length > 3;
  }, [calendars, enabled]);

  // ⚡ OPTIMIZATION: Memoize calendars to prevent infinite loops
  // Use a stable key based on calendar IDs and day counts
  const calendarsKey = useMemo(() => {
    if (calendars.length === 0) return "";
    return calendars
      .map((cal) => `${cal.id}-${cal.days.length}`)
      .sort()
      .join(",");
  }, [calendars]);

  useEffect(() => {
    if (!enabled || calendars.length === 0) {
      setCalendarDaysMap((prev) => {
        // Only update if map is not empty to prevent unnecessary re-renders
        if (prev.size === 0) return prev;
        return new Map();
      });
      setIsProcessing(false);
      return;
    }

    // Si no debemos usar worker, calcular directamente (más rápido para casos pequeños)
    if (!shouldUseWorker) {
      setIsProcessing(false);
      // El cálculo directo se hace en useOptimizedCalendarDaysMap
      return;
    }

    // Crear worker si no existe
    if (!workerRef.current) {
      try {
        // ⚡ OPTIMIZATION: Usar worker inline para evitar problemas de path
        const workerCode = `
          ${self.onmessage.toString().replace('self.onmessage', 'onmessage')}
        `;
        
        // Alternativa: usar blob URL
        const blob = new Blob(
          [
            `
            self.onmessage = function(e) {
              const { calendars, startDate, endDate, viewportStart, viewportEnd } = e.data;
              const start = new Date(startDate);
              const end = new Date(endDate);
              const map = new Map();
              const shouldLimitToViewport = viewportStart !== undefined && viewportEnd !== undefined;

              for (const calendar of calendars) {
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
                      
                      if (shouldLimitToViewport && viewportStart !== undefined && viewportEnd !== undefined) {
                        const dayIndex = Math.floor((recurringDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                        if (dayIndex < viewportStart || dayIndex > viewportEnd) continue;
                      }

                      if (recurringDate >= start && recurringDate <= end) {
                        const recurringDateKey = recurringDate.toISOString().slice(0, 10);
                        const existing = map.get(recurringDateKey);
                        if (existing) {
                          existing.push({ day, calendarName: calendar.name });
                        } else {
                          map.set(recurringDateKey, [{ day, calendarName: calendar.name }]);
                        }
                      }
                    }
                  } else {
                    const dayDate = new Date(day.date);
                    
                    if (shouldLimitToViewport && viewportStart !== undefined && viewportEnd !== undefined) {
                      const dayIndex = Math.floor((dayDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                      if (dayIndex < viewportStart || dayIndex > viewportEnd) continue;
                    }

                    if (dayDate >= start && dayDate <= end) {
                      const existing = map.get(dateKey);
                      if (existing) {
                        existing.push({ day, calendarName: calendar.name });
                      } else {
                        map.set(dateKey, [{ day, calendarName: calendar.name }]);
                      }
                    }
                  }
                }
              }

              const calendarDaysMapArray = Array.from(map.entries());
              self.postMessage({ type: 'CALENDARS_PROCESSED', calendarDaysMap: calendarDaysMapArray });
            };
          `,
          ],
          { type: "application/javascript" }
        );
        const workerUrl = URL.createObjectURL(blob);
        workerRef.current = new Worker(workerUrl);
        
        workerRef.current.onmessage = (e: MessageEvent) => {
          if (e.data.type === "CALENDARS_PROCESSED") {
            const map = new Map(e.data.calendarDaysMap);
            setCalendarDaysMap(map);
            setIsProcessing(false);
          }
        };

        workerRef.current.onerror = (error) => {
          console.error("[CalendarWorker] Error:", error);
          setIsProcessing(false);
          // Fallback: calcular directamente si worker falla
          setCalendarDaysMap(new Map());
        };
      } catch (error) {
        console.error("[CalendarWorker] Failed to create worker:", error);
        setIsProcessing(false);
        setCalendarDaysMap(new Map());
      }
    }

    // Procesar calendarios en worker
    if (workerRef.current) {
      setIsProcessing(true);
      workerRef.current.postMessage({
        type: "PROCESS_CALENDARS",
        calendars,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        viewportStart,
        viewportEnd,
      });
    }

    return () => {
      // Cleanup: worker se mantiene vivo para reutilización
      // Solo se termina cuando el componente se desmonta completamente
    };
  }, [
    calendarsKey,
    startDate,
    endDate,
    viewportStart,
    viewportEnd,
    enabled,
    shouldUseWorker,
  ]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return {
    calendarDaysMap,
    isProcessing,
    usingWorker: shouldUseWorker,
  };
}

