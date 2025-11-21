import { useCallback } from "react";
import type { Feature, ProductWithFeatures } from "@/features/feature/types";
import { generateFeatureId } from "@/features/feature";
import { categorizeError } from "@/api/resilience/ErrorHandler";

interface EditingState {
  productId: string;
  feature?: Feature;
}

interface UseFeatureMaintenanceHandlersProps {
  selectedProductId: string;
  selectedProduct: ProductWithFeatures | undefined;
  editingState: EditingState | null;
  setEditingState: (state: EditingState | null) => void;
  setOpenDialog: (open: boolean) => void;
  setIsDeleting: (id: string | null) => void;
  itOwners: Array<{ id: string; name: string }>;
  featureCategories: Array<{ id: string; name: string }>;
  createMutation: {
    mutateAsync: (data: unknown) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: { id: string; data: unknown }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
  };
}

/**
 * Hook for managing FeatureMaintenancePage event handlers
 */
export function useFeatureMaintenanceHandlers({
  selectedProductId,
  selectedProduct,
  editingState,
  setEditingState,
  setOpenDialog,
  setIsDeleting,
  itOwners,
  featureCategories,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseFeatureMaintenanceHandlersProps) {
  const handleAddFeature = useCallback(() => {
    if (!selectedProductId) return;

    // Use first IT Owner if available, otherwise create a placeholder
    const defaultOwner =
      itOwners.length > 0
        ? { id: itOwners[0].id, name: itOwners[0].name }
        : { id: "", name: "" };

    // Use first Feature Category if available, otherwise create a placeholder
    const defaultCategory =
      featureCategories.length > 0
        ? {
            id: featureCategories[0].id,
            name: featureCategories[0].name,
          }
        : { id: "", name: "" };

    setEditingState({
      productId: selectedProductId,
      feature: {
        id: generateFeatureId(),
        name: "",
        description: "",
        category: defaultCategory,
        status: "planned",
        createdBy: defaultOwner,
        technicalDescription: "",
        businessDescription: "",
        productId: selectedProductId,
      },
    });
    setOpenDialog(true);
  }, [
    selectedProductId,
    itOwners,
    featureCategories,
    setEditingState,
    setOpenDialog,
  ]);

  const handleEditFeature = useCallback(
    (feature: Feature) => {
      if (!selectedProductId) return;

      setEditingState({
        productId: selectedProductId,
        feature,
      });
      setOpenDialog(true);
    },
    [selectedProductId, setEditingState, setOpenDialog]
  );

  const handleDeleteFeature = useCallback(
    async (featureId: string) => {
      if (!selectedProductId) return;
      if (!globalThis.confirm("Are you sure you want to delete this feature?"))
        return;

      setIsDeleting(featureId);
      try {
        await deleteMutation.mutateAsync(featureId);
      } catch (error: unknown) {
        console.error("Error deleting feature:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting feature. Please try again.");
        }
      } finally {
        setIsDeleting(null);
      }
    },
    [selectedProductId, deleteMutation, setIsDeleting]
  );

  const handleSaveFeature = useCallback(
    async (feature: Feature) => {
      if (!editingState) return;

      const isNew = !selectedProduct?.features.some((f) => f.id === feature.id);

      // Validate required fields
      const name = feature.name?.trim();
      const description = feature.description?.trim();
      const technicalDescription = feature.technicalDescription?.trim();
      const businessDescription = feature.businessDescription?.trim();

      if (!name) {
        if (globalThis.alert) {
          globalThis.alert("Feature name is required");
        }
        return;
      }

      if (!description) {
        if (globalThis.alert) {
          globalThis.alert("Feature description is required");
        }
        return;
      }

      if (!technicalDescription) {
        if (globalThis.alert) {
          globalThis.alert("Technical description is required");
        }
        return;
      }

      if (!businessDescription) {
        if (globalThis.alert) {
          globalThis.alert("Business description is required");
        }
        return;
      }

      // Ensure createdBy has a name (from IT Owner)
      if (!feature.createdBy?.name) {
        if (globalThis.alert) {
          globalThis.alert("IT Owner is required");
        }
        return;
      }

      try {
        // Prepare payload - prioritize categoryId if available
        const payload: Record<string, unknown> = {
          name,
          description,
          status: feature.status as unknown,
          createdBy: { name: feature.createdBy.name },
          technicalDescription,
          businessDescription,
        };

        // Handle category - prefer categoryId, fallback to category.name
        if (
          feature.category?.id &&
          !feature.category.id.startsWith("cat-")
        ) {
          // Valid UUID category ID
          payload.categoryId = feature.category.id;
        } else if (feature.category?.name) {
          // Fallback to category name
          payload.category = { name: feature.category.name };
        } else if (typeof feature.category === "string") {
          // Legacy string category
          payload.category = { name: feature.category };
        }

        // Handle country - prefer countryId
        if (
          feature.country?.id &&
          !feature.country.id.startsWith("country-")
        ) {
          // Valid UUID country ID
          payload.countryId = feature.country.id;
        }

        if (isNew) {
          payload.productId = editingState.productId;
          await createMutation.mutateAsync(payload);
        } else {
          await updateMutation.mutateAsync({
            id: feature.id,
            data: payload,
          });
        }
        setOpenDialog(false);
        setEditingState(null);
      } catch (error: unknown) {
        console.error("Error saving feature:", error);

        // Use ErrorHandler to get user-friendly message
        const errorContext = categorizeError(error);
        let errorMessage = errorContext.userMessage;

        // For 409 Conflict errors, try to extract the specific backend message
        const errorWithStatusCode = error as { statusCode?: number; message?: string };
        if (
          errorWithStatusCode?.statusCode === 409 &&
          errorWithStatusCode?.message
        ) {
          // Backend sends: "Feature with name "X" already exists"
          // Use the backend message directly as it's more specific
          errorMessage = errorWithStatusCode.message;
        }

        if (globalThis.alert) {
          globalThis.alert(errorMessage);
        }
      }
    },
    [
      editingState,
      selectedProduct,
      createMutation,
      updateMutation,
      setOpenDialog,
      setEditingState,
    ]
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingState(null);
  }, [setOpenDialog, setEditingState]);

  return {
    handleAddFeature,
    handleEditFeature,
    handleDeleteFeature,
    handleSaveFeature,
    handleCloseDialog,
  };
}

