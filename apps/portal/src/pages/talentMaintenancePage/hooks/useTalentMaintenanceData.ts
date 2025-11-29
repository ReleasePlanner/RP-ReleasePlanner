import { useMemo } from "react";
import type { Talent } from "@/api/services/talents.service";

interface UseTalentMaintenanceDataProps {
  talents: Talent[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting talents
 */
export function useTalentMaintenanceData({
  talents,
  searchQuery,
  sortBy,
}: UseTalentMaintenanceDataProps) {
  const filteredAndSortedTalents = useMemo(() => {
    let result = [...talents];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (talent) =>
          talent.name.toLowerCase().includes(queryLower) ||
          talent.email?.toLowerCase().includes(queryLower) ||
          talent.role?.name.toLowerCase().includes(queryLower)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "role") {
      result.sort((a, b) => {
        const roleA = a.role?.name || "";
        const roleB = b.role?.name || "";
        return roleA.localeCompare(roleB);
      });
    } else if (sortBy === "email") {
      result.sort((a, b) => {
        const emailA = a.email || "";
        const emailB = b.email || "";
        return emailA.localeCompare(emailB);
      });
    } else if (sortBy === "createdAt") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [talents, searchQuery, sortBy]);

  return {
    filteredAndSortedTalents,
  };
}

