import { useMemo } from "react";
import type { RescheduleType } from "@/api/services/rescheduleTypes.service";

interface UseRescheduleTypeMaintenanceDataProps {
  rescheduleTypes: RescheduleType[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting reschedule types
 */
export function useRescheduleTypeMaintenanceData({
  rescheduleTypes,
  searchQuery,
  sortBy,
}: UseRescheduleTypeMaintenanceDataProps) {
  const filteredAndSortedRescheduleTypes = useMemo(() => {
    let result = [...rescheduleTypes];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter((type) =>
        type.name.toLowerCase().includes(queryLower) ||
        (type.description && type.description.toLowerCase().includes(queryLower))
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [rescheduleTypes, searchQuery, sortBy]);

  return {
    filteredAndSortedRescheduleTypes,
  };
}

