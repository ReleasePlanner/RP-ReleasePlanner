import { useMemo } from "react";
import type { BasePhase } from "@/api/services/basePhases.service";

interface UsePhasesMaintenanceDataProps {
  phases: BasePhase[];
  searchQuery: string;
}

/**
 * Hook for filtering phases
 */
export function usePhasesMaintenanceData({
  phases,
  searchQuery,
}: UsePhasesMaintenanceDataProps) {
  const filteredPhases = useMemo(() => {
    let result = phases;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    return result;
  }, [phases, searchQuery]);

  return {
    filteredPhases,
  };
}
