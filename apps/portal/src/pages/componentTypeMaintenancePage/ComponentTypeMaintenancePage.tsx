/**
 * Component Type Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Component Types
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useComponentTypes,
  useCreateComponentType,
  useUpdateComponentType,
  useDeleteComponentType,
} from "@/api/hooks/useComponentTypes";
import { ComponentTypeEditDialog } from "@/features/componentType/components";
import {
  useComponentTypeMaintenanceState,
  useComponentTypeMaintenanceData,
  useComponentTypeMaintenanceHandlers,
} from "./hooks";
import {
  ComponentTypeMaintenanceLoadingState,
  ComponentTypeMaintenanceErrorState,
  ComponentTypeMaintenanceEmptyState,
  ComponentTypeMaintenanceList,
  AddComponentTypeButton,
} from "./components";

export function ComponentTypeMaintenancePage() {
  // State management
  const {
    editingType,
    setEditingType,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useComponentTypeMaintenanceState();

  // API hooks
  const { data: componentTypes = [], isLoading, error } = useComponentTypes();
  const createMutation = useCreateComponentType();
  const updateMutation = useUpdateComponentType();
  const deleteMutation = useDeleteComponentType();

  // Filter and sort data
  const { filteredAndSortedTypes } = useComponentTypeMaintenanceData({
    componentTypes,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddType,
    handleEditType,
    handleDeleteType,
    handleSave,
    handleCloseDialog,
  } = useComponentTypeMaintenanceHandlers({
    componentTypes,
    editingType,
    setEditingType,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [{ value: "name", label: "Sort: Name" }];

  // Loading state
  if (isLoading) {
    return <ComponentTypeMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <ComponentTypeMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Component Type Maintenance"
      description="Manage Component Types"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search component types..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddComponentTypeButton onClick={handleAddType} />}
    >
      {/* Component Types List */}
      {filteredAndSortedTypes.length === 0 ? (
        <ComponentTypeMaintenanceEmptyState
          componentTypesCount={componentTypes.length}
          searchQuery={searchQuery}
        />
      ) : (
        <ComponentTypeMaintenanceList
          types={filteredAndSortedTypes}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditType}
          onDelete={handleDeleteType}
        />
      )}

      {/* Edit Dialog */}
      {editingType && (
        <ComponentTypeEditDialog
          open={openDialog}
          componentType={editingType}
          onSave={handleSave}
          onClose={handleCloseDialog}
          onComponentTypeChange={setEditingType}
        />
      )}
    </PageLayout>
  );
}

export default ComponentTypeMaintenancePage;

