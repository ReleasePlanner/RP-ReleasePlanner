import { useMemo } from "react";
import type { Indicator } from "@/api/services/indicators.service";

interface UseIndicatorMaintenanceDataProps {
  indicators: Indicator[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting indicators
 */
export function useIndicatorMaintenanceData({
  indicators,
  searchQuery,
  sortBy,
}: UseIndicatorMaintenanceDataProps) {
  const filteredAndSortedIndicators = useMemo(() => {
    let result = [...indicators];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (indicator) =>
          indicator.name.toLowerCase().includes(queryLower) ||
          (indicator.description &&
            indicator.description.toLowerCase().includes(queryLower)) ||
          (indicator.formula &&
            indicator.formula.toLowerCase().includes(queryLower))
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "status") {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [indicators, searchQuery, sortBy]);

  return {
    filteredAndSortedIndicators,
  };
}

