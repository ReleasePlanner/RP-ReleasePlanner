/**
 * Web Worker para procesar calendarios en background
 * Evita bloquear el UI thread durante cálculos pesados
 */

interface CalendarDay {
  id: string;
  name: string;
  date: string;
  type: "holiday" | "special";
  description?: string;
  recurring: boolean;
}

interface Calendar {
  id: string;
  name: string;
  days: CalendarDay[];
}

interface ProcessCalendarsMessage {
  type: "PROCESS_CALENDARS";
  calendars: Calendar[];
  startDate: string;
  endDate: string;
  viewportStart?: number;
  viewportEnd?: number;
}

interface ProcessCalendarsResponse {
  type: "CALENDARS_PROCESSED";
  calendarDaysMap: Array<[string, Array<{ day: CalendarDay; calendarName: string }>]>;
}

self.onmessage = (e: MessageEvent<ProcessCalendarsMessage>) => {
  const { calendars, startDate, endDate, viewportStart, viewportEnd } = e.data;

  if (e.data.type !== "PROCESS_CALENDARS") {
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const map = new Map<string, Array<{ day: CalendarDay; calendarName: string }>>();

  const shouldLimitToViewport =
    viewportStart !== undefined && viewportEnd !== undefined;

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

          // Skip if outside viewport
          if (shouldLimitToViewport && viewportStart !== undefined && viewportEnd !== undefined) {
            const dayIndex = Math.floor(
              (recurringDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
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

        // Skip if outside viewport
        if (shouldLimitToViewport && viewportStart !== undefined && viewportEnd !== undefined) {
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

  // Convert Map to Array for transfer (Maps can't be transferred directly)
  const calendarDaysMapArray = Array.from(map.entries());

  const response: ProcessCalendarsResponse = {
    type: "CALENDARS_PROCESSED",
    calendarDaysMap: calendarDaysMapArray,
  };

  self.postMessage(response);
};

