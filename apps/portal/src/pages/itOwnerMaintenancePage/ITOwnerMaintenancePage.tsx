/**
 * IT Owner Maintenance Page
 *
 * Elegant, Material UI compliant page for managing IT Owners
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useITOwners,
  useCreateITOwner,
  useUpdateITOwner,
  useDeleteITOwner,
} from "@/api/hooks";
import { ITOwnerEditDialog } from "@/features/itOwner/components";
import {
  useITOwnerMaintenanceState,
  useITOwnerMaintenanceData,
  useITOwnerMaintenanceHandlers,
} from "./hooks";
import {
  ITOwnerMaintenanceLoadingState,
  ITOwnerMaintenanceErrorState,
  ITOwnerMaintenanceEmptyState,
  ITOwnerMaintenanceList,
  AddITOwnerButton,
} from "./components";

export function ITOwnerMaintenancePage() {
  // State management
  const {
    editingOwner,
    setEditingOwner,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useITOwnerMaintenanceState();

  // API hooks
  const { data: itOwners = [], isLoading, error } = useITOwners();
  const createMutation = useCreateITOwner();
  const updateMutation = useUpdateITOwner();
  const deleteMutation = useDeleteITOwner();

  // Filter and sort data
  const { filteredAndSortedOwners } = useITOwnerMaintenanceData({
    itOwners,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddOwner,
    handleEditOwner,
    handleDeleteOwner,
    handleSave,
    handleCloseDialog,
  } = useITOwnerMaintenanceHandlers({
    itOwners,
    editingOwner,
    setEditingOwner,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [{ value: "name", label: "Sort: Name" }];

  // Loading state
  if (isLoading) {
    return <ITOwnerMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <ITOwnerMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="IT Owner Maintenance"
      description="Manage IT Owners and their contact information"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search IT owners..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddITOwnerButton onClick={handleAddOwner} />}
    >
      {/* IT Owners List */}
      {filteredAndSortedOwners.length === 0 ? (
        <ITOwnerMaintenanceEmptyState
          ownersCount={itOwners.length}
          searchQuery={searchQuery}
        />
      ) : (
        <ITOwnerMaintenanceList
          owners={filteredAndSortedOwners}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditOwner}
          onDelete={handleDeleteOwner}
        />
      )}

      {/* Edit Dialog */}
      {editingOwner && (
        <ITOwnerEditDialog
          open={openDialog}
          owner={editingOwner}
          onSave={handleSave}
          onClose={handleCloseDialog}
          onChange={setEditingOwner}
        />
      )}
    </PageLayout>
  );
}

export default ITOwnerMaintenancePage;

