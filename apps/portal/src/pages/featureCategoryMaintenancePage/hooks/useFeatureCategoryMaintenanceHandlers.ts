import { useCallback } from "react";
import type { FeatureCategory } from "@/api/services/featureCategories.service";

interface UseFeatureCategoryMaintenanceHandlersProps {
  categories: FeatureCategory[];
  editingCategory: FeatureCategory | null;
  setEditingCategory: (category: FeatureCategory | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: { name: string }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: { name: string };
    }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

/**
 * Hook for managing FeatureCategoryMaintenancePage event handlers
 */
export function useFeatureCategoryMaintenanceHandlers({
  categories,
  editingCategory,
  setEditingCategory,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseFeatureCategoryMaintenanceHandlersProps) {
  const handleAddCategory = useCallback(() => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as FeatureCategory);
    setOpenDialog(true);
  }, [setEditingCategory, setOpenDialog]);

  const handleEditCategory = useCallback(
    (category: FeatureCategory) => {
      setEditingCategory(category);
      setOpenDialog(true);
    },
    [setEditingCategory, setOpenDialog]
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      if (
        !globalThis.confirm(
          "Are you sure you want to delete this feature category?"
        )
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(categoryId);
      } catch (error: unknown) {
        console.error("Error deleting feature category:", error);
        if (globalThis.alert) {
          globalThis.alert(
            "Error deleting feature category. Please try again."
          );
        }
      }
    },
    [deleteMutation]
  );

  const handleSave = useCallback(async () => {
    if (!editingCategory) return;

    try {
      const existingCategory = categories.find(
        (c) => c.id === editingCategory.id
      );
      if (existingCategory && !existingCategory.id.startsWith("cat-")) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: {
            name: editingCategory.name,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingCategory.name,
        });
      }
      setOpenDialog(false);
      setEditingCategory(null);
    } catch (error: unknown) {
      console.error("Error saving feature category:", error);
    }
  }, [
    editingCategory,
    categories,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingCategory,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCategory(null);
  }, [setOpenDialog, setEditingCategory]);

  return {
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSave,
    handleCloseDialog,
  };
}

