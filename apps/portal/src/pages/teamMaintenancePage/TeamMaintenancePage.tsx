import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useTeams,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
} from "@/api/hooks/useTeams";
import { TeamEditDialog } from "./components";
import {
  useTeamMaintenanceState,
  useTeamMaintenanceData,
  useTeamMaintenanceHandlers,
} from "./hooks";
import {
  TeamMaintenanceLoadingState,
  TeamMaintenanceErrorState,
  TeamMaintenanceEmptyState,
  TeamMaintenanceList,
  AddTeamButton,
} from "./components";
import type { Team } from "@/api/services/teams.service";

export function TeamMaintenancePage() {
  // State management
  const {
    editingTeam,
    setEditingTeam,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useTeamMaintenanceState();

  // API hooks
  const { data: teams = [], isLoading, error } = useTeams();
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const deleteMutation = useDeleteTeam();

  // Filter and sort data
  const { filteredAndSortedTeams } = useTeamMaintenanceData({
    teams,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddTeam,
    handleEditTeam,
    handleDeleteTeam,
    handleSave,
    handleCloseDialog,
  } = useTeamMaintenanceHandlers({
    teams,
    editingTeam,
    setEditingTeam,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "type", label: "Sort: Type" },
    { value: "talents", label: "Sort: Talents Count" },
    { value: "createdAt", label: "Sort: Created At" },
  ];

  // Loading state
  if (isLoading) {
    return <TeamMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <TeamMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Teams Maintenance"
      description="Manage teams and their talents."
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search teams..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddTeamButton onClick={handleAddTeam} />}
    >
      {/* Teams List */}
      {filteredAndSortedTeams.length === 0 ? (
        <TeamMaintenanceEmptyState
          teamsCount={teams.length}
          searchQuery={searchQuery}
        />
      ) : (
        <TeamMaintenanceList
          teams={filteredAndSortedTeams}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditTeam}
          onDelete={handleDeleteTeam}
        />
      )}

      {/* Edit Dialog */}
      <TeamEditDialog
        open={openDialog}
        team={editingTeam}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onTeamChange={(team: Team) => {
          setEditingTeam(team);
        }}
      />
    </PageLayout>
  );
}

export default TeamMaintenancePage;

