import { useMemo } from "react";
import type { Plan } from "@/features/releasePlans/types";
import type { FilterStatus, SortOption } from "./useReleasePlannerState";

interface UseReleasePlannerDataProps {
  plans: Plan[];
  debouncedSearchQuery: string;
  statusFilter: FilterStatus;
  startDateFilter: string;
  endDateFilter: string;
  sortBy: SortOption;
}

/**
 * Hook for filtering and sorting plans
 */
export function useReleasePlannerData({
  plans,
  debouncedSearchQuery,
  statusFilter,
  startDateFilter,
  endDateFilter,
  sortBy,
}: UseReleasePlannerDataProps) {
  const filteredAndSortedPlans = useMemo(() => {
    let result = [...plans];

    // Search filter (using debounced query)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.metadata.name.toLowerCase().includes(query) ||
          p.metadata.description?.toLowerCase().includes(query) ||
          p.metadata.owner.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.metadata.status === statusFilter);
    }

    // Date filters
    if (startDateFilter) {
      result = result.filter((p) => {
        const planStartDate = new Date(p.metadata.startDate);
        const filterDate = new Date(startDateFilter);
        return planStartDate >= filterDate;
      });
    }

    if (endDateFilter) {
      result = result.filter((p) => {
        const planEndDate = new Date(p.metadata.endDate);
        const filterDate = new Date(endDateFilter);
        return planEndDate <= filterDate;
      });
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
        break;
      case "startDate":
        result.sort((a, b) =>
          a.metadata.startDate.localeCompare(b.metadata.startDate)
        );
        break;
      case "endDate":
        result.sort((a, b) =>
          b.metadata.endDate.localeCompare(a.metadata.endDate)
        );
        break;
      case "status":
        result.sort((a, b) =>
          a.metadata.status.localeCompare(b.metadata.status)
        );
        break;
      case "owner":
        result.sort((a, b) => a.metadata.owner.localeCompare(b.metadata.owner));
        break;
    }

    return result;
  }, [plans, debouncedSearchQuery, statusFilter, startDateFilter, endDateFilter, sortBy]);

  return {
    filteredAndSortedPlans,
  };
}

