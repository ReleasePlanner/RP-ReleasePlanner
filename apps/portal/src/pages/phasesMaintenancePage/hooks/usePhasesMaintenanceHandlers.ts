import { useCallback } from "react";
import type { BasePhase } from "@/api/services/basePhases.service";

interface UsePhasesMaintenanceHandlersProps {
  editingPhase: BasePhase | null;
  formData: Partial<BasePhase>;
  phaseToDelete: BasePhase | null;
  setEditingPhase: (phase: BasePhase | null) => void;
  setFormData: (data: Partial<BasePhase>) => void;
  setDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setPhaseToDelete: (phase: BasePhase | null) => void;
  createMutation: {
    mutateAsync: (data: {
      name: string;
      color: string;
      isDefault?: boolean;
    }) => Promise<unknown>;
    isPending: boolean;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: { name: string; color: string; isDefault?: boolean };
    }) => Promise<unknown>;
    isPending: boolean;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
  reorderMutation: {
    mutateAsync: (phaseIds: string[]) => Promise<unknown>;
    isPending: boolean;
  };
  phases: BasePhase[];
}

/**
 * Hook for managing PhasesMaintenancePage event handlers
 */
export function usePhasesMaintenanceHandlers({
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
  phases,
}: UsePhasesMaintenanceHandlersProps) {
  const handleOpenDialog = useCallback(
    (phase?: BasePhase) => {
      if (phase) {
        setEditingPhase(phase);
        setFormData({
          name: phase.name,
          color: phase.color,
          isDefault: phase.isDefault || false,
        });
      } else {
        setEditingPhase(null);
        setFormData({
          name: "",
          color: "#1976D2",
          isDefault: false,
        });
      }
      setDialogOpen(true);
    },
    [setEditingPhase, setFormData, setDialogOpen]
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingPhase(null);
    setFormData({
      name: "",
      color: "#1976D2",
      isDefault: false,
    });
  }, [setDialogOpen, setEditingPhase, setFormData]);

  const handleSave = useCallback(async () => {
    if (!formData.name?.trim()) return;

    try {
      if (editingPhase) {
        await updateMutation.mutateAsync({
          id: editingPhase.id,
          data: {
            name: formData.name.trim(),
            color: formData.color || "#1976D2",
            isDefault: formData.isDefault || false,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          color: formData.color || "#1976D2",
          isDefault: formData.isDefault || false,
        });
      }
      handleCloseDialog();
    } catch (error: unknown) {
      console.error("Error saving phase:", error);
      // Error handling is done by React Query
    }
  }, [
    formData,
    editingPhase,
    createMutation,
    updateMutation,
    handleCloseDialog,
  ]);

  const handleDeleteClick = useCallback(
    (phase: BasePhase) => {
      setPhaseToDelete(phase);
      setDeleteDialogOpen(true);
    },
    [setPhaseToDelete, setDeleteDialogOpen]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (phaseToDelete) {
      try {
        await deleteMutation.mutateAsync(phaseToDelete.id);
        setDeleteDialogOpen(false);
        setPhaseToDelete(null);
      } catch (error: unknown) {
        console.error("Error deleting phase:", error);
        // Error handling is done by React Query
      }
    }
  }, [phaseToDelete, deleteMutation, setDeleteDialogOpen, setPhaseToDelete]);

  const handleDuplicate = useCallback(
    (phase: BasePhase) => {
      setFormData({
        name: `${phase.name} (Copia)`,
        color: phase.color,
        isDefault: false, // Duplicated phases are not default by default
      });
      setEditingPhase(null);
      setDialogOpen(true);
    },
    [setFormData, setEditingPhase, setDialogOpen]
  );

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setPhaseToDelete(null);
  }, [setDeleteDialogOpen, setPhaseToDelete]);

  const handleMoveUp = useCallback(
    async (phase: BasePhase) => {
      const currentIndex = phases.findIndex((p) => p.id === phase.id);
      if (currentIndex <= 0) return;

      const newOrder = [...phases];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [
        newOrder[currentIndex],
        newOrder[currentIndex - 1],
      ];

      try {
        await reorderMutation.mutateAsync(newOrder.map((p) => p.id));
      } catch (error: unknown) {
        console.error("Error reordering phases:", error);
        // Error handling is done by React Query
      }
    },
    [phases, reorderMutation]
  );

  const handleMoveDown = useCallback(
    async (phase: BasePhase) => {
      const currentIndex = phases.findIndex((p) => p.id === phase.id);
      if (currentIndex < 0 || currentIndex >= phases.length - 1) return;

      const newOrder = [...phases];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];

      try {
        await reorderMutation.mutateAsync(newOrder.map((p) => p.id));
      } catch (error: unknown) {
        console.error("Error reordering phases:", error);
        // Error handling is done by React Query
      }
    },
    [phases, reorderMutation]
  );

  return {
    handleOpenDialog,
    handleCloseDialog,
    handleSave,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDuplicate,
    handleCloseDeleteDialog,
    handleMoveUp,
    handleMoveDown,
  };
}
