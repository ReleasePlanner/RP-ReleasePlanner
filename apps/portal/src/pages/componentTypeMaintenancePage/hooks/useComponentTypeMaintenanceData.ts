import { useMemo } from "react";
import type { ComponentType } from "@/api/services/componentTypes.service";

interface UseComponentTypeMaintenanceDataProps {
  componentTypes: ComponentType[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting component types
 */
export function useComponentTypeMaintenanceData({
  componentTypes,
  searchQuery,
  sortBy,
}: UseComponentTypeMaintenanceDataProps) {
  const filteredAndSortedTypes = useMemo(() => {
    let result = [...componentTypes];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (type) =>
          type.name.toLowerCase().includes(queryLower) ||
          type.code?.toLowerCase().includes(queryLower) ||
          type.description?.toLowerCase().includes(queryLower)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [componentTypes, searchQuery, sortBy]);

  return {
    filteredAndSortedTypes,
  };
}

