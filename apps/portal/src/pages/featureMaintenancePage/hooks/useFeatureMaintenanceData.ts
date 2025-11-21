import { useMemo } from "react";
import type { Feature, ProductWithFeatures } from "@/features/feature/types";
import type { Feature as APIFeature } from "@/api/services/features.service";

interface UseFeatureMaintenanceDataProps {
  apiProducts: Array<{ id: string; name: string }>;
  allFeatures: APIFeature[];
  selectedProductId: string;
  searchQuery: string;
  sortBy: string;
}

/**
 * Hook for converting API features to local format and combining products with features
 */
export function useFeatureMaintenanceData({
  apiProducts,
  allFeatures,
  selectedProductId,
  searchQuery,
  sortBy,
}: UseFeatureMaintenanceDataProps) {
  // Convert API features to local Feature format
  const convertAPIFeatureToLocal = (apiFeature: APIFeature): Feature => {
    return {
      id: apiFeature.id,
      name: apiFeature.name,
      description: apiFeature.description,
      category:
        typeof apiFeature.category === "string"
          ? { id: "", name: apiFeature.category }
          : { id: apiFeature.category.id, name: apiFeature.category.name },
      status:
        apiFeature.status === "in-progress"
          ? "in-progress"
          : (apiFeature.status as any),
      createdBy:
        typeof apiFeature.createdBy === "string"
          ? { id: "", name: apiFeature.createdBy }
          : { id: apiFeature.createdBy.id, name: apiFeature.createdBy.name },
      technicalDescription: apiFeature.technicalDescription,
      businessDescription: apiFeature.businessDescription,
      productId: apiFeature.productId,
      country: apiFeature.country
        ? {
            id: apiFeature.country.id,
            name: apiFeature.country.name,
            code: apiFeature.country.code,
          }
        : undefined,
    };
  };

  // Combine products with their features from API
  const productsWithFeatures: ProductWithFeatures[] = useMemo(() => {
    return apiProducts.map((product) => {
      const productFeatures = allFeatures.filter(
        (f) => f.productId === product.id
      );
      return {
        id: product.id,
        name: product.name,
        features: productFeatures.map(convertAPIFeatureToLocal),
      };
    });
  }, [apiProducts, allFeatures]);

  const selectedProduct = productsWithFeatures.find(
    (p) => p.id === selectedProductId
  );

  // Filter and sort features
  const filteredAndSortedFeatures = useMemo(() => {
    if (!selectedProduct) return [];

    let result = [...selectedProduct.features];

    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(queryLower) ||
          f.description?.toLowerCase().includes(queryLower) ||
          f.category?.name?.toLowerCase().includes(queryLower)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "status") {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [selectedProduct, searchQuery, sortBy]);

  return {
    productsWithFeatures,
    selectedProduct,
    filteredAndSortedFeatures,
  };
}

