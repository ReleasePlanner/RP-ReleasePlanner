/**
 * Indicator Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Indicators/KPIs
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useIndicators,
  useCreateIndicator,
  useUpdateIndicator,
  useDeleteIndicator,
} from "@/api/hooks/useIndicators";
import { IndicatorEditDialog } from "./components";
import {
  useIndicatorMaintenanceState,
  useIndicatorMaintenanceData,
  useIndicatorMaintenanceHandlers,
} from "./hooks";
import {
  IndicatorMaintenanceLoadingState,
  IndicatorMaintenanceErrorState,
  IndicatorMaintenanceEmptyState,
  IndicatorMaintenanceList,
  AddIndicatorButton,
} from "./components";
import type { Indicator } from "@/api/services/indicators.service";

export function IndicatorMaintenancePage() {
  // State management
  const {
    editingIndicator,
    setEditingIndicator,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useIndicatorMaintenanceState();

  // API hooks
  const { data: indicators = [], isLoading, error } = useIndicators();
  const createMutation = useCreateIndicator();
  const updateMutation = useUpdateIndicator();
  const deleteMutation = useDeleteIndicator();

  // Filter and sort data
  const { filteredAndSortedIndicators } = useIndicatorMaintenanceData({
    indicators,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddIndicator,
    handleEditIndicator,
    handleDeleteIndicator,
    handleSave,
    handleCloseDialog,
  } = useIndicatorMaintenanceHandlers({
    indicators,
    editingIndicator,
    setEditingIndicator,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "status", label: "Sort: Status" },
  ];

  // Loading state
  if (isLoading) {
    return <IndicatorMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <IndicatorMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Indicator Maintenance"
      description="Manage KPIs and indicators"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search indicators..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddIndicatorButton onClick={handleAddIndicator} />}
    >
      {/* Indicators List */}
      {filteredAndSortedIndicators.length === 0 ? (
        <IndicatorMaintenanceEmptyState
          indicatorsCount={indicators.length}
          searchQuery={searchQuery}
        />
      ) : (
        <IndicatorMaintenanceList
          indicators={filteredAndSortedIndicators}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditIndicator}
          onDelete={handleDeleteIndicator}
        />
      )}

      {/* Edit Dialog */}
      <IndicatorEditDialog
        open={openDialog}
        indicator={editingIndicator}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onIndicatorChange={(indicator: Indicator) => {
          setEditingIndicator(indicator);
        }}
      />
    </PageLayout>
  );
}

export default IndicatorMaintenancePage;

