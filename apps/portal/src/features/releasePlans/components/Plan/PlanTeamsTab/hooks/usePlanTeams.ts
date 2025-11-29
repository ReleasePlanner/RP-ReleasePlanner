import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { Team } from "@/api/services/teams.service";
import { teamsService } from "@/api/services/teams.service";

export type PlanTeamsData = {
  planTeams: Team[];
  isLoading: boolean;
  hasError: boolean;
};

export function usePlanTeams(teamIds: string[]): PlanTeamsData {
  // Ensure teamIds is always an array and filter out invalid IDs
  // Keep original order (don't sort) to match the order teams were added
  const safeTeamIds = useMemo(() => {
    if (!Array.isArray(teamIds)) return [];
    return teamIds.filter((id) => id && typeof id === "string" && id.trim() !== "");
  }, [teamIds]);

  // Create queries config - useMemo ensures queries array is recreated when safeTeamIds changes
  // This is critical for useQueries to detect new team IDs
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

  // Get teams that are in the plan
  const planTeams = useMemo(() => {
    return teamQueries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => query.data!);
  }, [teamQueries]);

  // Only show loading if we have teamIds to load and queries are loading
  const isLoading = safeTeamIds.length > 0 && teamQueries.some((query) => query.isLoading);
  const hasError = teamQueries.some((query) => query.isError);

  return {
    planTeams,
    isLoading,
    hasError,
  };
}

