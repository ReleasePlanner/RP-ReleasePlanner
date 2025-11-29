import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { Team } from "@/api/services/teams.service";
import { teamsService } from "@/api/services/teams.service";

export type PlanTalent = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roleId?: string;
  role?: { id: string; name: string };
};

export type PlanTalentsData = {
  talents: PlanTalent[];
  isLoading: boolean;
  hasError: boolean;
};

/**
 * Hook to get all talents from teams assigned to a plan
 * @param teamIds - Array of team IDs assigned to the plan
 * @returns Object with talents array, loading state, and error state
 */
export function usePlanTalents(teamIds: string[]): PlanTalentsData {
  // Ensure teamIds is always an array and filter out invalid IDs
  const safeTeamIds = useMemo(() => {
    if (!Array.isArray(teamIds)) return [];
    return teamIds.filter((id) => id && typeof id === "string" && id.trim() !== "");
  }, [teamIds]);

  // Create queries config - useMemo ensures queries array is recreated when safeTeamIds changes
  const queriesConfig = useMemo(
    () =>
      safeTeamIds.map((id) => ({
        queryKey: ["teams", "detail", id] as const,
        queryFn: () => teamsService.getById(id),
        enabled: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      })),
    [safeTeamIds]
  );

  // Load teams from API using the team IDs
  const teamQueries = useQueries({
    queries: queriesConfig,
  });

  // Extract and deduplicate talents from all teams
  const talents = useMemo(() => {
    const talentMap = new Map<string, PlanTalent>();

    teamQueries.forEach((query) => {
      if (query.isSuccess && query.data) {
        const team: Team = query.data;
        if (team.talents && Array.isArray(team.talents)) {
          team.talents.forEach((talent) => {
            if (talent.id && !talentMap.has(talent.id)) {
              talentMap.set(talent.id, {
                id: talent.id,
                name: talent.name,
                email: talent.email,
                phone: talent.phone,
                roleId: talent.roleId,
                role: talent.role,
              });
            }
          });
        }
      }
    });

    // Return talents sorted by name
    return Array.from(talentMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [teamQueries]);

  const isLoading = safeTeamIds.length > 0 && teamQueries.some((query) => query.isLoading);
  const hasError = teamQueries.some((query) => query.isError);

  return {
    talents,
    isLoading,
    hasError,
  };
}

