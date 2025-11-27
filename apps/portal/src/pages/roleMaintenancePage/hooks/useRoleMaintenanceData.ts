import { useMemo } from "react";
import type { Role } from "@/api/services/roles.service";

interface UseRoleMaintenanceDataProps {
  roles: Role[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting roles
 */
export function useRoleMaintenanceData({
  roles,
  searchQuery,
  sortBy,
}: UseRoleMaintenanceDataProps) {
  const filteredAndSortedRoles = useMemo(() => {
    let result = [...roles];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (role) =>
          role.name.toLowerCase().includes(queryLower)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "createdAt") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [roles, searchQuery, sortBy]);

  return {
    filteredAndSortedRoles,
  };
}

