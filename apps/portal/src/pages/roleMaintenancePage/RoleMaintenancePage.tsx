import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/api/hooks/useRoles";
import { RoleEditDialog } from "./components";
import {
  useRoleMaintenanceState,
  useRoleMaintenanceData,
  useRoleMaintenanceHandlers,
} from "./hooks";
import {
  RoleMaintenanceLoadingState,
  RoleMaintenanceErrorState,
  RoleMaintenanceEmptyState,
  RoleMaintenanceList,
  AddRoleButton,
} from "./components";
import type { Role } from "@/api/services/roles.service";

export function RoleMaintenancePage() {
  // State management
  const {
    editingRole,
    setEditingRole,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useRoleMaintenanceState();

  // API hooks
  const { data: roles = [], isLoading, error } = useRoles();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  // Filter and sort data
  const { filteredAndSortedRoles } = useRoleMaintenanceData({
    roles,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddRole,
    handleEditRole,
    handleDeleteRole,
    handleSave,
    handleCloseDialog,
  } = useRoleMaintenanceHandlers({
    roles,
    editingRole,
    setEditingRole,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "createdAt", label: "Sort: Created At" },
  ];

  // Loading state
  if (isLoading) {
    return <RoleMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <RoleMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Roles Maintenance"
      description="Manage roles and profiles for talents."
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search roles..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddRoleButton onClick={handleAddRole} />}
    >
      {/* Roles List */}
      {filteredAndSortedRoles.length === 0 ? (
        <RoleMaintenanceEmptyState
          rolesCount={roles.length}
          searchQuery={searchQuery}
        />
      ) : (
        <RoleMaintenanceList
          roles={filteredAndSortedRoles}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />
      )}

      {/* Edit Dialog */}
      <RoleEditDialog
        open={openDialog}
        role={editingRole}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onRoleChange={(role: Role) => {
          setEditingRole(role);
        }}
      />
    </PageLayout>
  );
}

export default RoleMaintenancePage;

