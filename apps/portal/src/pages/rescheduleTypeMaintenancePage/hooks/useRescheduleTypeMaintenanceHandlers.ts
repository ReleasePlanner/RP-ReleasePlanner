import { useCallback } from "react";
import type { RescheduleType } from "@/api/services/rescheduleTypes.service";

interface UseRescheduleTypeMaintenanceHandlersProps {
  rescheduleTypes: RescheduleType[];
  editingRescheduleType: RescheduleType | null;
  setEditingRescheduleType: (type: RescheduleType | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: { name: string; description?: string }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: { name?: string; description?: string };
    }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

/**
 * Hook for managing RescheduleTypeMaintenancePage event handlers
 */
export function useRescheduleTypeMaintenanceHandlers({
  rescheduleTypes,
  editingRescheduleType,
  setEditingRescheduleType,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseRescheduleTypeMaintenanceHandlersProps) {
  const handleAddRescheduleType = useCallback(() => {
    setEditingRescheduleType({
      id: `reschedule-type-${Date.now()}`,
      name: "",
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as RescheduleType);
    setOpenDialog(true);
  }, [setEditingRescheduleType, setOpenDialog]);

  const handleEditRescheduleType = useCallback(
    (type: RescheduleType) => {
      setEditingRescheduleType(type);
      setOpenDialog(true);
    },
    [setEditingRescheduleType, setOpenDialog]
  );

  const handleDeleteRescheduleType = useCallback(
    async (typeId: string) => {
      if (
        !globalThis.confirm("Are you sure you want to delete this Reschedule Type?")
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(typeId);
      } catch (error: unknown) {
        console.error("Error deleting reschedule type:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting Reschedule Type. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const handleSave = useCallback(async () => {
    if (!editingRescheduleType) return;

    try {
      const existingType = rescheduleTypes.find((t) => t.id === editingRescheduleType.id);
      if (existingType && !editingRescheduleType.id.startsWith('reschedule-type-')) {
        await updateMutation.mutateAsync({
          id: editingRescheduleType.id,
          data: {
            name: editingRescheduleType.name,
            description: editingRescheduleType.description,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingRescheduleType.name,
          description: editingRescheduleType.description,
        });
      }
      setOpenDialog(false);
      setEditingRescheduleType(null);
    } catch (error: unknown) {
      console.error("Error saving reschedule type:", error);
    }
  }, [
    editingRescheduleType,
    rescheduleTypes,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingRescheduleType,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingRescheduleType(null);
  }, [setOpenDialog, setEditingRescheduleType]);

  return {
    handleAddRescheduleType,
    handleEditRescheduleType,
    handleDeleteRescheduleType,
    handleSave,
    handleCloseDialog,
  };
}

