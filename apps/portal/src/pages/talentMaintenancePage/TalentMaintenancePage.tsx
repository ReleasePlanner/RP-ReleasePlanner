import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useTalents,
  useCreateTalent,
  useUpdateTalent,
  useDeleteTalent,
} from "@/api/hooks/useTalents";
import { TalentEditDialog } from "./components";
import {
  useTalentMaintenanceState,
  useTalentMaintenanceData,
  useTalentMaintenanceHandlers,
} from "./hooks";
import {
  TalentMaintenanceLoadingState,
  TalentMaintenanceErrorState,
  TalentMaintenanceEmptyState,
  TalentMaintenanceList,
  AddTalentButton,
} from "./components";
import type { Talent } from "@/api/services/talents.service";

export function TalentMaintenancePage() {
  // State management
  const {
    editingTalent,
    setEditingTalent,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useTalentMaintenanceState();

  // API hooks
  const { data: talents = [], isLoading, error } = useTalents();
  const createMutation = useCreateTalent();
  const updateMutation = useUpdateTalent();
  const deleteMutation = useDeleteTalent();

  // Filter and sort data
  const { filteredAndSortedTalents } = useTalentMaintenanceData({
    talents,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddTalent,
    handleEditTalent,
    handleDeleteTalent,
    handleSave,
    handleCloseDialog,
  } = useTalentMaintenanceHandlers({
    talents,
    editingTalent,
    setEditingTalent,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "role", label: "Sort: Role" },
    { value: "email", label: "Sort: Email" },
    { value: "createdAt", label: "Sort: Created At" },
  ];

  // Loading state
  if (isLoading) {
    return <TalentMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <TalentMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Talents Maintenance"
      description="Manage talents and their roles."
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search talents..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddTalentButton onClick={handleAddTalent} />}
    >
      {/* Talents List */}
      {filteredAndSortedTalents.length === 0 ? (
        <TalentMaintenanceEmptyState
          talentsCount={talents.length}
          searchQuery={searchQuery}
        />
      ) : (
        <TalentMaintenanceList
          talents={filteredAndSortedTalents}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditTalent}
          onDelete={handleDeleteTalent}
        />
      )}

      {/* Edit Dialog */}
      <TalentEditDialog
        open={openDialog}
        talent={editingTalent}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onTalentChange={(talent: Talent) => {
          setEditingTalent(talent);
        }}
      />
    </PageLayout>
  );
}

export default TalentMaintenancePage;

