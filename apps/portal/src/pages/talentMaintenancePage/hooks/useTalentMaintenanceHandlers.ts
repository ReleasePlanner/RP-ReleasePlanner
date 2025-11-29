import { useCallback } from "react";
import type {
  Talent,
  CreateTalentDto,
  UpdateTalentDto,
} from "@/api/services/talents.service";

interface UseTalentMaintenanceHandlersProps {
  talents: Talent[];
  editingTalent: Talent | null;
  setEditingTalent: (talent: Talent | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: CreateTalentDto) => Promise<Talent>;
  };
  updateMutation: {
    mutateAsync: (params: { id: string; data: UpdateTalentDto }) => Promise<Talent>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<void>;
    isPending: boolean;
  };
}

/**
 * Hook for managing TalentMaintenancePage event handlers
 */
export function useTalentMaintenanceHandlers({
  talents,
  editingTalent,
  setEditingTalent,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseTalentMaintenanceHandlersProps) {
  const handleAddTalent = useCallback(() => {
    setEditingTalent({
      id: `talent-${Date.now()}`, // Temporary ID for new talent
      name: "",
      email: "",
      phone: "",
      roleId: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setOpenDialog(true);
  }, [setEditingTalent, setOpenDialog]);

  const handleEditTalent = useCallback(
    (talent: Talent) => {
      setEditingTalent(talent);
      setOpenDialog(true);
    },
    [setEditingTalent, setOpenDialog]
  );

  const handleDeleteTalent = useCallback(
    async (talentId: string) => {
      if (
        !globalThis.confirm("Are you sure you want to delete this talent?")
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(talentId);
      } catch (error: unknown) {
        console.error("Error deleting talent:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting talent. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const validateTalentData = useCallback((talent: Talent): string | null => {
    // Validate talent name
    if (!talent.name?.trim()) {
      return "Talent name is required";
    }

    // Validate email format if provided
    if (talent.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(talent.email)) {
      return "Invalid email format";
    }

    return null;
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingTalent) return;

    // Validate talent data
    const validationError = validateTalentData(editingTalent);
    if (validationError) {
      if (globalThis.alert) {
        globalThis.alert(validationError);
      }
      return;
    }

    try {
      const existingTalent = talents.find((t) => t.id === editingTalent.id);
      const isNewTalent =
        existingTalent === undefined || existingTalent.id.startsWith("talent-");

      const talentData = {
        name: editingTalent.name,
        email: editingTalent.email || undefined,
        phone: editingTalent.phone || undefined,
        roleId: editingTalent.roleId || undefined,
      };

      if (isNewTalent) {
        await createMutation.mutateAsync(talentData);
      } else {
        await updateMutation.mutateAsync({
          id: editingTalent.id,
          data: {
            ...talentData,
            id: editingTalent.id,
            updatedAt: editingTalent.updatedAt,
          },
        });
      }

      setOpenDialog(false);
      setEditingTalent(null);
    } catch (error: unknown) {
      console.error("Error saving talent:", error);
      if (globalThis.alert) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        globalThis.alert(`Error saving talent: ${errorMessage}`);
      }
    }
  }, [
    editingTalent,
    talents,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingTalent,
    validateTalentData,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingTalent(null);
  }, [setOpenDialog, setEditingTalent]);

  return {
    handleAddTalent,
    handleEditTalent,
    handleDeleteTalent,
    handleSave,
    handleCloseDialog,
  };
}

