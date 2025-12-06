/**
 * Phases Maintenance Page
 *
 * Minimalist page for managing phases across all release plans
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, BaseEditDialog } from "@/components";
import {
  useBasePhases,
  useCreateBasePhase,
  useUpdateBasePhase,
  useDeleteBasePhase,
  useReorderBasePhases,
} from "@/api/hooks";
import {
  usePhasesMaintenanceState,
  usePhasesMaintenanceData,
  usePhasesMaintenanceHandlers,
} from "./hooks";
import {
  PhasesMaintenanceLoadingState,
  PhasesMaintenanceErrorState,
  PhasesMaintenanceEmptyState,
  PhasesMaintenanceList,
  AddPhaseButton,
  PhaseEditDialogContent,
  PhaseDeleteDialog,
} from "./components";

export function PhasesMaintenancePage() {
  // State management
  const {
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    phaseToDelete,
    setPhaseToDelete,
    editingPhase,
    setEditingPhase,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    formData,
    setFormData,
  } = usePhasesMaintenanceState();

  // API hooks - MUST be called before any conditional returns
  const { data: phases = [], isLoading, error } = useBasePhases();
  const createMutation = useCreateBasePhase();
  const updateMutation = useUpdateBasePhase();
  const deleteMutation = useDeleteBasePhase();
  const reorderMutation = useReorderBasePhases();

  // Filter data - MUST be called before any conditional returns
  const { filteredPhases } = usePhasesMaintenanceData({
    phases,
    searchQuery,
  });

  // Event handlers - MUST be called before any conditional returns
  const {
    handleOpenDialog,
    handleCloseDialog,
    handleSave,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDuplicate,
    handleCloseDeleteDialog,
    handleMoveUp,
    handleMoveDown,
  } = usePhasesMaintenanceHandlers({
    editingPhase,
    formData,
    phaseToDelete,
    setEditingPhase,
    setFormData,
    setDialogOpen,
    setDeleteDialogOpen,
    setPhaseToDelete,
    createMutation,
    updateMutation,
    deleteMutation,
    reorderMutation,
    phases: filteredPhases,
  });

  // Loading state - AFTER all hooks
  if (isLoading) {
    return <PhasesMaintenanceLoadingState />;
  }

  // Error state - AFTER all hooks
  if (error) {
    return <PhasesMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Phases Maintenance"
      description="Manage base phases that can be used in release plans"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={[{ value: "name", label: "Sort: Name" }]}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search phases..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddPhaseButton onClick={() => handleOpenDialog()} />}
    >
      {/* Phases List */}
      {filteredPhases.length === 0 ? (
        <PhasesMaintenanceEmptyState
          phasesCount={phases.length}
          searchQuery={searchQuery}
        />
      ) : (
        <PhasesMaintenanceList
          phases={filteredPhases}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
          onDuplicate={handleDuplicate}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      )}

      {/* Edit/Create Dialog */}
      <BaseEditDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editing={!!editingPhase}
        title={editingPhase ? "Edit Phase" : "New Phase"}
        subtitle={
          editingPhase
            ? "Modify the base phase details"
            : "Create a new base phase to use in plans"
        }
        maxWidth="sm"
        onSave={handleSave}
        saveButtonText={editingPhase ? "Save Changes" : "Create Phase"}
        isFormValid={
          !!formData.name?.trim() &&
          !createMutation.isPending &&
          !updateMutation.isPending
        }
        saveButtonDisabled={
          createMutation.isPending || updateMutation.isPending
        }
      >
        <PhaseEditDialogContent
          formData={formData}
          onFormDataChange={setFormData}
        />
      </BaseEditDialog>

      {/* Delete Confirmation Dialog */}
      <PhaseDeleteDialog
        open={deleteDialogOpen}
        phase={phaseToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </PageLayout>
  );
}

export default PhasesMaintenancePage;
