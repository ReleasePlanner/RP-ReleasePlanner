import { useMemo } from "react";
import type { Country } from "@/api/services/countries.service";

interface UseCountryMaintenanceDataProps {
  countries: Country[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting countries
 */
export function useCountryMaintenanceData({
  countries,
  searchQuery,
  sortBy,
}: UseCountryMaintenanceDataProps) {
  const filteredAndSortedCountries = useMemo(() => {
    let result = [...countries];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (country) =>
          country.name.toLowerCase().includes(queryLower) ||
          country.code.toLowerCase().includes(queryLower) ||
          (country.region &&
            country.region.toLowerCase().includes(queryLower))
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "code") {
      result.sort((a, b) => a.code.localeCompare(b.code));
    } else if (sortBy === "region") {
      result.sort((a, b) => {
        const regionA = a.region || "";
        const regionB = b.region || "";
        return regionA.localeCompare(regionB);
      });
    }

    return result;
  }, [countries, searchQuery, sortBy]);

  return {
    filteredAndSortedCountries,
  };
}

