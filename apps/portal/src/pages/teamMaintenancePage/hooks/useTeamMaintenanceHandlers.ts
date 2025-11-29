import { useCallback } from "react";
import type {
  Team,
  CreateTeamDto,
  UpdateTeamDto,
} from "@/api/services/teams.service";
import { TeamType as TeamTypeEnum } from "@/api/services/teams.service";
import { talentsService } from "@/api/services/talents.service";

interface UseTeamMaintenanceHandlersProps {
  teams: Team[];
  editingTeam: Team | null;
  setEditingTeam: (team: Team | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: CreateTeamDto) => Promise<Team>;
  };
  updateMutation: {
    mutateAsync: (params: { id: string; data: UpdateTeamDto }) => Promise<Team>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<void>;
    isPending: boolean;
  };
}

/**
 * Hook for managing TeamMaintenancePage event handlers
 */
export function useTeamMaintenanceHandlers({
  teams,
  editingTeam,
  setEditingTeam,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseTeamMaintenanceHandlersProps) {
  const handleAddTeam = useCallback(() => {
    setEditingTeam({
      id: `team-${Date.now()}`, // Temporary ID for new team
      name: "",
      description: "",
      type: TeamTypeEnum.INTERNAL,
      talents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setOpenDialog(true);
  }, [setEditingTeam, setOpenDialog]);

  const handleEditTeam = useCallback(
    (team: Team) => {
      setEditingTeam(team);
      setOpenDialog(true);
    },
    [setEditingTeam, setOpenDialog]
  );

  const handleDeleteTeam = useCallback(
    async (teamId: string) => {
      if (!globalThis.confirm("Are you sure you want to delete this team?")) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(teamId);
      } catch (error: unknown) {
        console.error("Error deleting team:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting team. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const validateTeamData = useCallback((team: Team): string | null => {
    // Validate team name
    if (!team.name?.trim()) {
      return "Team name is required";
    }

    // Validate talents
    const invalidTalents = (team.talents || []).filter(
      (talent) => !talent.name?.trim()
    );
    if (invalidTalents.length > 0) {
      return "All talents must have a name. Please fill in the name for all talents.";
    }

    // Validate allocation percentages
    const invalidAllocations = (team.talents || []).filter((talent) => {
      const allocation = talent.allocationPercentage ?? 100;
      return allocation < 0 || allocation > 100;
    });
    if (invalidAllocations.length > 0) {
      return "Allocation percentage must be between 0 and 100 for all talents.";
    }

    return null;
  }, []);

  const createNewTalents = useCallback(
    async (newTalents: Team["talents"]): Promise<Team["talents"]> => {
      if (!newTalents || newTalents.length === 0) {
        return [];
      }

      const createdTalents = await Promise.all(
        newTalents.map(async (talent) => {
          try {
            const created = await talentsService.create({
              name: talent.name,
              email: talent.email || undefined,
              phone: talent.phone || undefined,
              roleId: talent.roleId || undefined,
            });
            // Ensure we have a valid UUID from the created talent
            if (!created.id || created.id.trim() === "") {
              throw new Error(
                `Talent "${talent.name}" was created but did not receive a valid ID`
              );
            }
            return {
              ...talent,
              id: created.id,
            };
          } catch (error) {
            console.error(`Error creating talent ${talent.name}:`, error);
            throw new Error(
              `Failed to create talent "${talent.name}": ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          }
        })
      );

      return createdTalents;
    },
    []
  );

  const buildTalentAssignments = useCallback((talents: Team["talents"]) => {
    // Only include talents with valid UUIDs (not temporary IDs)
    return (talents || [])
      .filter((talent) => {
        // Filter out talents with temporary IDs or invalid IDs
        const id = talent?.id;
        return (
          id &&
          typeof id === "string" &&
          !id.startsWith("talent-") &&
          id.trim() !== ""
        );
      })
      .map((talent) => {
        // TypeScript knows id exists due to filter above
        const id = talent.id;
        if (!id) return null;
        return {
          talentId: id,
          allocationPercentage: Math.max(
            0,
            Math.min(100, talent.allocationPercentage ?? 100)
          ),
        };
      })
      .filter(
        (
          assignment
        ): assignment is { talentId: string; allocationPercentage: number } =>
          assignment !== null
      );
  }, []);

  const prepareTalentsForSave = useCallback(
    async (talents: Team["talents"]) => {
      const newTalents = (talents || []).filter(
        (talent) => talent.id && talent.id.startsWith("talent-")
      );
      const existingTalents = (talents || []).filter(
        (talent) =>
          talent.id &&
          !talent.id.startsWith("talent-") &&
          talent.id.trim() !== ""
      );

      if (newTalents.length === 0) {
        return existingTalents;
      }

      const createdTalents = await createNewTalents(newTalents);
      // Filter out any created talents that don't have valid IDs
      const validCreatedTalents = createdTalents.filter(
        (talent) =>
          talent.id &&
          !talent.id.startsWith("talent-") &&
          talent.id.trim() !== ""
      );
      return [...existingTalents, ...validCreatedTalents];
    },
    [createNewTalents]
  );

  const handleSave = useCallback(async () => {
    if (!editingTeam) return;

    // Validate team data
    const validationError = validateTeamData(editingTeam);
    if (validationError) {
      if (globalThis.alert) {
        globalThis.alert(validationError);
      }
      return;
    }

    try {
      const existingTeam = teams.find((t) => t.id === editingTeam.id);
      const isNewTeam =
        existingTeam === undefined || existingTeam.id.startsWith("team-");

      // Prepare talents (create new ones if needed)
      let allTalents: Team["talents"];
      try {
        allTalents = await prepareTalentsForSave(editingTeam.talents);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        if (globalThis.alert) {
          globalThis.alert(`Error creating talents: ${errorMessage}`);
        }
        return;
      }

      // Build talent assignments
      const talentAssignments = buildTalentAssignments(allTalents);

      const teamData = {
        name: editingTeam.name,
        description: editingTeam.description,
        type: editingTeam.type,
        talentAssignments:
          talentAssignments.length > 0 ? talentAssignments : undefined,
      };

      if (isNewTeam) {
        await createMutation.mutateAsync(teamData);
      } else {
        await updateMutation.mutateAsync({
          id: editingTeam.id,
          data: {
            ...teamData,
            id: editingTeam.id, // Include id in the body as required by UpdateTeamDto
            updatedAt: editingTeam.updatedAt,
          },
        });
      }

      setOpenDialog(false);
      setEditingTeam(null);
    } catch (error: unknown) {
      console.error("Error saving team:", error);
      if (globalThis.alert) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        globalThis.alert(`Error saving team: ${errorMessage}`);
      }
    }
  }, [
    editingTeam,
    teams,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingTeam,
    validateTeamData,
    prepareTalentsForSave,
    buildTalentAssignments,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingTeam(null);
  }, [setOpenDialog, setEditingTeam]);

  return {
    handleAddTeam,
    handleEditTeam,
    handleDeleteTeam,
    handleSave,
    handleCloseDialog,
  };
}
