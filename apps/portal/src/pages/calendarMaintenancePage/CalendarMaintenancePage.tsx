/**
 * Calendar Maintenance Page - Elegant, Material UI compliant page
 *
 * Main page for managing holidays and special days by country
 * Refactored with Separation of Concerns (SoC)
 */

import { Box } from "@mui/material";
import { PageLayout } from "@/components";
import { CalendarDayEditDialog } from "@/features/calendar";
import type { CalendarDay } from "@/features/calendar/types";
import {
  useCalendars,
  useCreateCalendar,
  useUpdateCalendar,
} from "@/api/hooks";
import { useCountries } from "@/api/hooks/useCountries";
import {
  useCalendarMaintenanceState,
  useCalendarMaintenanceData,
  useCalendarMaintenanceHandlers,
} from "./hooks";
import {
  CalendarMaintenanceLoadingState,
  CalendarMaintenanceErrorState,
  CalendarMaintenanceSidebar,
  CalendarMaintenanceContent,
} from "./components";

export function CalendarMaintenancePage() {
  // State management
  const {
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
  } = useCalendarMaintenanceState();

  // API hooks
  const {
    data: apiCalendars = [],
    isLoading,
    error,
  } = useCalendars(selectedCountryId);
  const createMutation = useCreateCalendar();
  const updateMutation = useUpdateCalendar();
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  // Get selected country
  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  // Calendar data conversion and selection
  const { currentCalendar } = useCalendarMaintenanceData({
    selectedCountryId,
    apiCalendars,
    selectedCountry,
  });

  // Event handlers
  const {
    handleAddDay,
    handleEditDay,
    handleDeleteDay,
    handleSaveDay,
    handleCloseDialog,
  } = useCalendarMaintenanceHandlers({
    selectedCountryId,
    selectedCountry,
    currentCalendar,
    editingState,
    setEditingState,
    setOpenDialog,
    createMutation,
    updateMutation,
  });

  // Loading state
  if (isLoading || countriesLoading) {
    return <CalendarMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <CalendarMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Calendar Management"
      description="Manage holidays and special days by country"
    >
      {/* Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 3,
        }}
      >
        {/* Sidebar: Country Selector */}
        <CalendarMaintenanceSidebar
          countries={countries}
          selectedCountryId={selectedCountryId}
          selectedCountry={selectedCountry}
          currentCalendar={currentCalendar}
          onCountryChange={setSelectedCountryId}
        />

        {/* Main: Days List */}
        <CalendarMaintenanceContent
          selectedCountryId={selectedCountryId}
          currentCalendar={currentCalendar}
          viewMode={viewMode}
          filterType={filterType}
          sortBy={sortBy}
          searchQuery={searchQuery}
          onViewModeChange={setViewMode}
          onFilterChange={setFilterType}
          onSortChange={setSortBy}
          onSearchChange={setSearchQuery}
          onAddDay={handleAddDay}
          onEditDay={handleEditDay}
          onDeleteDay={handleDeleteDay}
        />
      </Box>

      {/* Day Edit Dialog */}
      <CalendarDayEditDialog
        open={openDialog}
        editing={editingState?.day !== undefined}
        day={editingState?.day || null}
        calendarName={currentCalendar?.name || selectedCountry?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSaveDay}
        onDayChange={(day: CalendarDay) => {
          if (editingState) {
            setEditingState({
              ...editingState,
              day,
            });
          }
        }}
      />
    </PageLayout>
  );
}

export default CalendarMaintenancePage;

