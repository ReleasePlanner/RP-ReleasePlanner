import { useCallback } from "react";
import type { ComponentType } from "@/api/services/componentTypes.service";

interface UseComponentTypeMaintenanceHandlersProps {
  componentTypes: ComponentType[];
  editingType: ComponentType | null;
  setEditingType: (type: ComponentType | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: {
      name: string;
      code?: string;
      description?: string;
    }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: {
        name: string;
        code: string;
        description: string;
      };
    }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

/**
 * Hook for managing ComponentTypeMaintenancePage event handlers
 */
export function useComponentTypeMaintenanceHandlers({
  componentTypes,
  editingType,
  setEditingType,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseComponentTypeMaintenanceHandlersProps) {
  const handleAddType = useCallback(() => {
    setEditingType({
      id: `type-${Date.now()}`,
      name: "",
      code: "",
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ComponentType);
    setOpenDialog(true);
  }, [setEditingType, setOpenDialog]);

  const handleEditType = useCallback(
    (type: ComponentType) => {
      setEditingType(type);
      setOpenDialog(true);
    },
    [setEditingType, setOpenDialog]
  );

  const handleDeleteType = useCallback(
    async (typeId: string) => {
      if (
        !globalThis.confirm(
          "Are you sure you want to delete this component type?"
        )
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(typeId);
      } catch (error: unknown) {
        console.error("Error deleting component type:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting component type. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const handleSave = useCallback(async () => {
    if (!editingType) return;

    try {
      const existingType = componentTypes.find((t) => t.id === editingType.id);
      if (existingType) {
        await updateMutation.mutateAsync({
          id: editingType.id,
          data: {
            name: editingType.name,
            code: editingType.code,
            description: editingType.description,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingType.name,
          code: editingType.code || undefined,
          description: editingType.description || undefined,
        });
      }
      setOpenDialog(false);
      setEditingType(null);
    } catch (error: unknown) {
      console.error("Error saving component type:", error);
    }
  }, [
    editingType,
    componentTypes,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingType,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingType(null);
  }, [setOpenDialog, setEditingType]);

  return {
    handleAddType,
    handleEditType,
    handleDeleteType,
    handleSave,
    handleCloseDialog,
  };
}

