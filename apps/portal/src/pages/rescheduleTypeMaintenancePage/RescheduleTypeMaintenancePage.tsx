/**
 * Reschedule Type Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Reschedule Types
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useRescheduleTypes,
  useCreateRescheduleType,
  useUpdateRescheduleType,
  useDeleteRescheduleType,
} from "@/api/hooks";
import {
  useRescheduleTypeMaintenanceState,
  useRescheduleTypeMaintenanceData,
  useRescheduleTypeMaintenanceHandlers,
} from "./hooks";
import {
  RescheduleTypeMaintenanceLoadingState,
  RescheduleTypeMaintenanceErrorState,
  RescheduleTypeMaintenanceEmptyState,
  RescheduleTypeMaintenanceList,
  AddRescheduleTypeButton,
  RescheduleTypeEditDialog,
} from "./components";

export function RescheduleTypeMaintenancePage() {
  // State management
  const {
    editingRescheduleType,
    setEditingRescheduleType,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useRescheduleTypeMaintenanceState();

  // API hooks
  const { data: rescheduleTypes = [], isLoading, error } = useRescheduleTypes();
  const createMutation = useCreateRescheduleType();
  const updateMutation = useUpdateRescheduleType();
  const deleteMutation = useDeleteRescheduleType();

  // Filter and sort data
  const { filteredAndSortedRescheduleTypes } = useRescheduleTypeMaintenanceData({
    rescheduleTypes,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddRescheduleType,
    handleEditRescheduleType,
    handleDeleteRescheduleType,
    handleSave,
    handleCloseDialog,
  } = useRescheduleTypeMaintenanceHandlers({
    rescheduleTypes,
    editingRescheduleType,
    setEditingRescheduleType,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [{ value: "name", label: "Sort: Name" }];

  // Loading state
  if (isLoading) {
    return <RescheduleTypeMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <RescheduleTypeMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Reschedule Type Maintenance"
      description="Manage reschedule types for phase date changes"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search reschedule types..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddRescheduleTypeButton onClick={handleAddRescheduleType} />}
    >
      {/* Reschedule Types List */}
      {filteredAndSortedRescheduleTypes.length === 0 ? (
        <RescheduleTypeMaintenanceEmptyState
          rescheduleTypesCount={rescheduleTypes.length}
          searchQuery={searchQuery}
        />
      ) : (
        <RescheduleTypeMaintenanceList
          rescheduleTypes={filteredAndSortedRescheduleTypes}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditRescheduleType}
          onDelete={handleDeleteRescheduleType}
        />
      )}

      {/* Edit Dialog */}
      {editingRescheduleType && (
        <RescheduleTypeEditDialog
          open={openDialog}
          rescheduleType={editingRescheduleType}
          onSave={handleSave}
          onClose={handleCloseDialog}
          onChange={setEditingRescheduleType}
        />
      )}
    </PageLayout>
  );
}

export default RescheduleTypeMaintenancePage;

