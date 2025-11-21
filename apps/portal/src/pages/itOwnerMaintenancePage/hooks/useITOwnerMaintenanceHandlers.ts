import { useCallback } from "react";
import type { ITOwner } from "@/api/services/itOwners.service";

interface UseITOwnerMaintenanceHandlersProps {
  itOwners: ITOwner[];
  editingOwner: ITOwner | null;
  setEditingOwner: (owner: ITOwner | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: { name: string }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: { name: string };
    }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

/**
 * Hook for managing ITOwnerMaintenancePage event handlers
 */
export function useITOwnerMaintenanceHandlers({
  itOwners,
  editingOwner,
  setEditingOwner,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseITOwnerMaintenanceHandlersProps) {
  const handleAddOwner = useCallback(() => {
    setEditingOwner({
      id: `owner-${Date.now()}`,
      name: "",
    } as ITOwner);
    setOpenDialog(true);
  }, [setEditingOwner, setOpenDialog]);

  const handleEditOwner = useCallback(
    (owner: ITOwner) => {
      setEditingOwner(owner);
      setOpenDialog(true);
    },
    [setEditingOwner, setOpenDialog]
  );

  const handleDeleteOwner = useCallback(
    async (ownerId: string) => {
      if (
        !globalThis.confirm("Are you sure you want to delete this IT Owner?")
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(ownerId);
      } catch (error: unknown) {
        console.error("Error deleting IT owner:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting IT Owner. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const handleSave = useCallback(async () => {
    if (!editingOwner) return;

    try {
      const existingOwner = itOwners.find((o) => o.id === editingOwner.id);
      if (existingOwner) {
        await updateMutation.mutateAsync({
          id: editingOwner.id,
          data: {
            name: editingOwner.name,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingOwner.name,
        });
      }
      setOpenDialog(false);
      setEditingOwner(null);
    } catch (error: unknown) {
      console.error("Error saving IT owner:", error);
    }
  }, [
    editingOwner,
    itOwners,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingOwner,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingOwner(null);
  }, [setOpenDialog, setEditingOwner]);

  return {
    handleAddOwner,
    handleEditOwner,
    handleDeleteOwner,
    handleSave,
    handleCloseDialog,
  };
}

