import { useState } from "react";
import type { CalendarDay, ViewMode, FilterType, SortBy } from "@/features/calendar/types";

export interface EditingState {
  calendarId: string;
  day: CalendarDay;
}

/**
 * Hook for managing CalendarMaintenancePage state
 */
export function useCalendarMaintenanceState() {
  const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>(undefined);
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    selectedCountryId,
    setSelectedCountryId,
    editingState,
    setEditingState,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  };
}

