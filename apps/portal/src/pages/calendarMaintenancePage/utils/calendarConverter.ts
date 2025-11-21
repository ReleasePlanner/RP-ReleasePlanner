import type { CalendarDay } from "@/features/calendar/types";
import type {
  Calendar,
  CalendarDay as APICalendarDay,
} from "@/api/services/calendars.service";

/**
 * Convert API calendar to local format
 */
export function convertAPICalendarToLocal(
  apiCalendar: Calendar
): {
  id: string;
  name: string;
  description?: string;
  country?: {
    id: string;
    name: string;
    code: string;
  };
  days: CalendarDay[];
  createdAt: string;
  updatedAt: string;
} {
  return {
    id: apiCalendar.id,
    name: apiCalendar.name,
    description: apiCalendar.description,
    country: apiCalendar.country,
    days: apiCalendar.days.map((day: APICalendarDay) => ({
      id: day.id,
      name: day.name,
      date: day.date,
      type: day.type,
      description: day.description,
      recurring: day.recurring,
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    })),
    createdAt: apiCalendar.createdAt,
    updatedAt: apiCalendar.updatedAt,
  };
}

