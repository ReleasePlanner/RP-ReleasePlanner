import { memo } from "react";
import { Box } from "@mui/material";
import type { Calendar, CalendarDay, ViewMode, FilterType, SortBy } from "@/features/calendar/types";
import { CalendarDaysList } from "@/features/calendar";
import { CalendarMaintenanceEmptyState } from "./CalendarMaintenanceEmptyState";

export type CalendarMaintenanceContentProps = {
  readonly selectedCountryId: string | undefined;
  readonly currentCalendar: Calendar | undefined;
  readonly viewMode: ViewMode;
  readonly filterType: FilterType;
  readonly sortBy: SortBy;
  readonly searchQuery: string;
  readonly onViewModeChange: (mode: ViewMode) => void;
  readonly onFilterChange: (type: FilterType) => void;
  readonly onSortChange: (sort: SortBy) => void;
  readonly onSearchChange: (query: string) => void;
  readonly onAddDay: () => void;
  readonly onEditDay: (day: CalendarDay) => void;
  readonly onDeleteDay: (dayId: string) => void;
};

/**
 * Component for the main content area (days list or empty state)
 */
export const CalendarMaintenanceContent = memo(function CalendarMaintenanceContent({
  selectedCountryId,
  currentCalendar,
  viewMode,
  filterType,
  sortBy,
  searchQuery,
  onViewModeChange,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onAddDay,
  onEditDay,
  onDeleteDay,
}: CalendarMaintenanceContentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {selectedCountryId ? (
        <CalendarDaysList
          calendar={currentCalendar}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          filterType={filterType}
          onFilterChange={onFilterChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onAddDay={onAddDay}
          onEditDay={onEditDay}
          onDeleteDay={onDeleteDay}
        />
      ) : (
        <CalendarMaintenanceEmptyState />
      )}
    </Box>
  );
});

