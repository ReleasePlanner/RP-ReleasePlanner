import { useCallback } from "react";
import type { Indicator } from "@/api/services/indicators.service";

interface UseIndicatorMaintenanceHandlersProps {
  indicators: Indicator[];
  editingIndicator: Indicator | null;
  setEditingIndicator: (indicator: Indicator | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: {
      name: string;
      description?: string;
      formula?: string;
      status?: string;
    }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: {
        name?: string;
        description?: string;
        formula?: string;
        status?: string;
      };
    }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

/**
 * Hook for managing IndicatorMaintenancePage event handlers
 */
export function useIndicatorMaintenanceHandlers({
  indicators,
  editingIndicator,
  setEditingIndicator,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseIndicatorMaintenanceHandlersProps) {
  const handleAddIndicator = useCallback(() => {
    setEditingIndicator({
      id: `indicator-${Date.now()}`,
      name: "",
      description: "",
      formula: "",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Indicator);
    setOpenDialog(true);
  }, [setEditingIndicator, setOpenDialog]);

  const handleEditIndicator = useCallback(
    (indicator: Indicator) => {
      setEditingIndicator(indicator);
      setOpenDialog(true);
    },
    [setEditingIndicator, setOpenDialog]
  );

  const handleDeleteIndicator = useCallback(
    async (indicatorId: string) => {
      if (
        !globalThis.confirm("Are you sure you want to delete this indicator?")
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(indicatorId);
      } catch (error: unknown) {
        console.error("Error deleting indicator:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting indicator. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const handleSave = useCallback(async () => {
    if (!editingIndicator) return;

    try {
      const existingIndicator = indicators.find((i) => i.id === editingIndicator.id);
      if (existingIndicator && !existingIndicator.id.startsWith("indicator-")) {
        await updateMutation.mutateAsync({
          id: editingIndicator.id,
          data: {
            name: editingIndicator.name,
            description: editingIndicator.description,
            formula: editingIndicator.formula,
            status: editingIndicator.status,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingIndicator.name,
          description: editingIndicator.description,
          formula: editingIndicator.formula,
          status: editingIndicator.status,
        });
      }
      setOpenDialog(false);
      setEditingIndicator(null);
    } catch (error: unknown) {
      console.error("Error saving indicator:", error);
    }
  }, [
    editingIndicator,
    indicators,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingIndicator,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingIndicator(null);
  }, [setOpenDialog, setEditingIndicator]);

  return {
    handleAddIndicator,
    handleEditIndicator,
    handleDeleteIndicator,
    handleSave,
    handleCloseDialog,
  };
}

