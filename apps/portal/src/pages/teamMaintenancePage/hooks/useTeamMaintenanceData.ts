import { useMemo } from "react";
import type { Team } from "@/api/services/teams.service";

interface UseTeamMaintenanceDataProps {
  teams: Team[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting teams
 */
export function useTeamMaintenanceData({
  teams,
  searchQuery,
  sortBy,
}: UseTeamMaintenanceDataProps) {
  const filteredAndSortedTeams = useMemo(() => {
    let result = [...teams];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (team) =>
          team.name.toLowerCase().includes(queryLower) ||
          (team.description &&
            team.description.toLowerCase().includes(queryLower)) ||
          team.type.toLowerCase().includes(queryLower) ||
          team.talents.some(
            (talent) =>
              talent.name.toLowerCase().includes(queryLower) ||
              (talent.email && talent.email.toLowerCase().includes(queryLower)) ||
              (talent.role && talent.role.toLowerCase().includes(queryLower))
          )
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "type") {
      result.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortBy === "createdAt") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "talents") {
      result.sort((a, b) => b.talents.length - a.talents.length);
    }

    return result;
  }, [teams, searchQuery, sortBy]);

  return {
    filteredAndSortedTeams,
  };
}

