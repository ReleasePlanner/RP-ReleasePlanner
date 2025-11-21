import { useMemo } from "react";
import type { Calendar } from "@/api/services/calendars.service";
import type { Calendar as LocalCalendar } from "@/features/calendar/types";
import { convertAPICalendarToLocal } from "../utils/calendarConverter";

interface UseCalendarMaintenanceDataProps {
  selectedCountryId: string | undefined;
  apiCalendars: Calendar[];
  selectedCountry: { id: string; name: string; code: string; region?: string } | undefined;
}

/**
 * Hook for managing calendar data conversion and current calendar selection
 */
export function useCalendarMaintenanceData({
  selectedCountryId,
  apiCalendars,
  selectedCountry,
}: UseCalendarMaintenanceDataProps) {
  const currentCalendar = useMemo(() => {
    if (!selectedCountryId) return undefined;
    const calendars = apiCalendars.map(convertAPICalendarToLocal);
    // Find calendar for the selected country
    const calendar = calendars.find((c) => c.country?.id === selectedCountryId);

    // If no calendar exists, create a default one
    if (!calendar && selectedCountry) {
      // Return a placeholder calendar object that will be created when first day is added
      const now = new Date().toISOString();
      return {
        id: "",
        name: `${selectedCountry.name} Calendar`,
        description: `Holidays and special days for ${selectedCountry.name}`,
        country: {
          id: selectedCountry.id,
          name: selectedCountry.name,
          code: selectedCountry.code,
        },
        days: [],
        createdAt: now,
        updatedAt: now,
      } as LocalCalendar;
    }

    return calendar;
  }, [apiCalendars, selectedCountryId, selectedCountry]);

  return {
    currentCalendar,
  };
}

