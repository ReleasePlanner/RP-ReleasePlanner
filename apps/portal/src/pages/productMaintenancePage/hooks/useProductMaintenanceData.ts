import { useMemo } from "react";
import type { Product } from "@/api/services/products.service";

interface UseProductMaintenanceDataProps {
  products: Product[];
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for filtering and sorting products
 */
export function useProductMaintenanceData({
  products,
  searchQuery,
  sortBy,
}: UseProductMaintenanceDataProps) {
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(queryLower)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, searchQuery, sortBy]);

  return {
    filteredAndSortedProducts,
  };
}

