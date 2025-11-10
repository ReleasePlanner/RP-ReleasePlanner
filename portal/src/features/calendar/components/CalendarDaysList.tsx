/**
 * CalendarDaysList Component
 *
 * Displays calendar days with toolbar for filtering and sorting
 * Component for rendering calendar days in grid or list view
 */

import { useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type {
  Calendar,
  CalendarDay,
  FilterType,
  SortBy,
  ViewMode,
} from "../types";
import { processDays } from "../utils";
import { CalendarDayCard } from "./CalendarDayCard";

interface CalendarDaysListProps {
  calendar: Calendar | undefined;
  viewMode: ViewMode;
  filterType: FilterType;
  sortBy: SortBy;
  searchQuery: string;
  onAddDay: () => void;
  onEditDay: (day: CalendarDay) => void;
  onDeleteDay: (dayId: string) => void;
}

export function CalendarDaysList({
  calendar,
  viewMode,
  filterType,
  sortBy,
  searchQuery,
  onAddDay,
  onEditDay,
  onDeleteDay,
}: CalendarDaysListProps) {
  // Process days with filtering, searching, and sorting
  const processedDays = useMemo(() => {
    if (!calendar) return [];
    return processDays(calendar.days, filterType, searchQuery, sortBy);
  }, [calendar, filterType, searchQuery, sortBy]);

  if (!calendar) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Select a calendar to view and manage days
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Toolbar with controls - Simplified */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Typography variant="caption" color="text.secondary">
          {processedDays.length} day{processedDays.length !== 1 ? "s" : ""}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddDay}
          size="small"
        >
          Add Day
        </Button>
      </Box>

      {/* Days Grid/List */}
      {processedDays.length === 0 ? (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No days match the current filter
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              viewMode === "grid"
                ? { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }
                : "1fr",
            gap: 2,
          }}
        >
          {processedDays.map((day) => (
            <CalendarDayCard
              key={day.id}
              day={day}
              onEdit={onEditDay}
              onDelete={onDeleteDay}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
