/**
 * Feature Category Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Feature Categories
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useFeatureCategories,
  useCreateFeatureCategory,
  useUpdateFeatureCategory,
  useDeleteFeatureCategory,
} from "@/api/hooks/useFeatureCategories";
import { FeatureCategoryEditDialog } from "@/features/featureCategory/components";
import {
  useFeatureCategoryMaintenanceState,
  useFeatureCategoryMaintenanceData,
  useFeatureCategoryMaintenanceHandlers,
} from "./hooks";
import {
  FeatureCategoryMaintenanceLoadingState,
  FeatureCategoryMaintenanceErrorState,
  FeatureCategoryMaintenanceEmptyState,
  FeatureCategoryMaintenanceList,
  AddFeatureCategoryButton,
} from "./components";
import type { FeatureCategory } from "@/api/services/featureCategories.service";

export function FeatureCategoryMaintenancePage() {
  // State management
  const {
    editingCategory,
    setEditingCategory,
    openDialog,
    setOpenDialog,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useFeatureCategoryMaintenanceState();

  // API hooks
  const { data: categories = [], isLoading, error } = useFeatureCategories();
  const createMutation = useCreateFeatureCategory();
  const updateMutation = useUpdateFeatureCategory();
  const deleteMutation = useDeleteFeatureCategory();

  // Filter and sort data
  const { filteredAndSortedCategories } = useFeatureCategoryMaintenanceData({
    categories,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSave,
    handleCloseDialog,
  } = useFeatureCategoryMaintenanceHandlers({
    categories,
    editingCategory,
    setEditingCategory,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [{ value: "name", label: "Sort: Name" }];

  // Loading state
  if (isLoading) {
    return <FeatureCategoryMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <FeatureCategoryMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Feature Category Maintenance"
      description="Manage Feature Categories"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search categories..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddFeatureCategoryButton onClick={handleAddCategory} />}
    >
      {/* Feature Categories List */}
      {filteredAndSortedCategories.length === 0 ? (
        <FeatureCategoryMaintenanceEmptyState
          categoriesCount={categories.length}
          searchQuery={searchQuery}
        />
      ) : (
        <FeatureCategoryMaintenanceList
          categories={filteredAndSortedCategories}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {/* Edit Dialog */}
      {editingCategory && (
        <FeatureCategoryEditDialog
          open={openDialog}
          category={editingCategory}
          onSave={handleSave}
          onClose={handleCloseDialog}
          onCategoryChange={setEditingCategory}
        />
      )}
    </PageLayout>
  );
}

export default FeatureCategoryMaintenancePage;

