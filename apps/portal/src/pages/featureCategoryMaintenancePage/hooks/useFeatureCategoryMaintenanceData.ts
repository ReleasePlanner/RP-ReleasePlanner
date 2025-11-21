import { useMemo } from "react";
import type { FeatureCategory } from "@/api/services/featureCategories.service";

interface UseFeatureCategoryMaintenanceDataProps {
  categories: FeatureCategory[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting feature categories
 */
export function useFeatureCategoryMaintenanceData({
  categories,
  searchQuery,
  sortBy,
}: UseFeatureCategoryMaintenanceDataProps) {
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter((category) =>
        category.name.toLowerCase().includes(queryLower)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [categories, searchQuery, sortBy]);

  return {
    filteredAndSortedCategories,
  };
}

