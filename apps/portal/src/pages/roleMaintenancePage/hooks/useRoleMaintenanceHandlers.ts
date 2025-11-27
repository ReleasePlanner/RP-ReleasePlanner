import { useCallback } from "react";
import type { Role, CreateRoleDto, UpdateRoleDto } from "@/api/services/roles.service";

interface UseRoleMaintenanceHandlersProps {
  roles: Role[];
  editingRole: Role | null;
  setEditingRole: (role: Role | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: CreateRoleDto) => Promise<Role>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: UpdateRoleDto;
    }) => Promise<Role>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<void>;
    isPending: boolean;
  };
}

/**
 * Hook for managing RoleMaintenancePage event handlers
 */
export function useRoleMaintenanceHandlers({
  roles,
  editingRole,
  setEditingRole,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseRoleMaintenanceHandlersProps) {
  const handleAddRole = useCallback(() => {
    setEditingRole({
      id: `role-${Date.now()}`, // Temporary ID for new role
      name: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Role);
    setOpenDialog(true);
  }, [setEditingRole, setOpenDialog]);

  const handleEditRole = useCallback(
    (role: Role) => {
      setEditingRole(role);
      setOpenDialog(true);
    },
    [setEditingRole, setOpenDialog]
  );

  const handleDeleteRole = useCallback(
    async (roleId: string) => {
      if (
        !globalThis.confirm("Are you sure you want to delete this role?")
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(roleId);
      } catch (error: unknown) {
        console.error("Error deleting role:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting role. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const handleSave = useCallback(async () => {
    if (!editingRole) return;

    try {
      const existingRole = roles.find((r) => r.id === editingRole.id);
      if (existingRole && !existingRole.id.startsWith("role-")) {
        // Update existing role
        await updateMutation.mutateAsync({
          id: editingRole.id,
          data: {
            name: editingRole.name,
            updatedAt: editingRole.updatedAt, // Pass for optimistic locking
          },
        });
      } else {
        // Create new role
        await createMutation.mutateAsync({
          name: editingRole.name,
        });
      }
      setOpenDialog(false);
      setEditingRole(null);
    } catch (error: unknown) {
      console.error("Error saving role:", error);
      if (globalThis.alert) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        globalThis.alert(`Error saving role: ${errorMessage}`);
      }
    }
  }, [
    editingRole,
    roles,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingRole,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingRole(null);
  }, [setOpenDialog, setEditingRole]);

  return {
    handleAddRole,
    handleEditRole,
    handleDeleteRole,
    handleSave,
    handleCloseDialog,
  };
}

