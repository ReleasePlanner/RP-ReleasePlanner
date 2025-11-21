import { useMemo } from "react";
import type { ITOwner } from "@/api/services/itOwners.service";

interface UseITOwnerMaintenanceDataProps {
  itOwners: ITOwner[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting IT owners
 */
export function useITOwnerMaintenanceData({
  itOwners,
  searchQuery,
  sortBy,
}: UseITOwnerMaintenanceDataProps) {
  const filteredAndSortedOwners = useMemo(() => {
    let result = [...itOwners];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter((owner) =>
        owner.name.toLowerCase().includes(queryLower)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [itOwners, searchQuery, sortBy]);

  return {
    filteredAndSortedOwners,
  };
}

