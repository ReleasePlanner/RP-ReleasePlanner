/**
 * Feature Maintenance Page
 *
 * Minimalist and elegant Material UI page for managing features across products
 * Refactored with Separation of Concerns (SoC)
 */

import { useEffect } from "react";
import { Box, useTheme, alpha } from "@mui/material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import type { Feature, ProductWithFeatures } from "@/features/feature/types";
import {
  ProductSelector,
  ProductFeaturesList,
  FeatureEditDialog,
} from "@/features/feature";
import {
  useProducts,
  useFeatures,
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
} from "@/api/hooks";
import { useITOwners } from "@/api/hooks/useITOwners";
import { useFeatureCategories } from "@/api/hooks/useFeatureCategories";
import {
  useFeatureMaintenanceState,
  useFeatureMaintenanceData,
  useFeatureMaintenanceHandlers,
} from "./hooks";
import {
  FeatureMaintenanceLoadingState,
  FeatureMaintenanceErrorState,
  FeatureMaintenanceEmptyState,
  AddFeatureButton,
} from "./components";

/**
 * FeatureMaintenancePage Component
 *
 * Main page for managing features across products.
 */
export function FeatureMaintenancePage() {
  const theme = useTheme();

  // State management
  const {
    selectedProductId,
    setSelectedProductId,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    editingState,
    setEditingState,
    openDialog,
    setOpenDialog,
    isDeleting,
    setIsDeleting,
  } = useFeatureMaintenanceState();

  // API hooks
  const {
    data: apiProducts = [],
    isLoading: productsLoading,
    error: productsError,
  } = useProducts();
  const {
    data: allFeatures = [],
    isLoading: featuresLoading,
    error: featuresError,
  } = useFeatures();
  const { data: itOwners = [] } = useITOwners();
  const { data: featureCategories = [] } = useFeatureCategories();
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();
  const deleteMutation = useDeleteFeature();

  // Data processing
  const { productsWithFeatures, selectedProduct, filteredAndSortedFeatures } =
    useFeatureMaintenanceData({
      apiProducts,
      allFeatures,
      selectedProductId,
      searchQuery,
      sortBy,
    });

  // Set initial selected product when products are loaded
  useEffect(() => {
    if (
      !selectedProductId &&
      productsWithFeatures.length > 0 &&
      productsWithFeatures[0]?.id
    ) {
      setSelectedProductId(productsWithFeatures[0].id);
    }
  }, [selectedProductId, productsWithFeatures, setSelectedProductId]);

  // Event handlers
  const {
    handleAddFeature,
    handleEditFeature,
    handleDeleteFeature,
    handleSaveFeature,
    handleCloseDialog,
  } = useFeatureMaintenanceHandlers({
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
  });

  const isLoading = productsLoading || featuresLoading;
  const error = productsError || featuresError;

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "status", label: "Sort: Status" },
  ];

  // Loading state
  if (isLoading) {
    return <FeatureMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <FeatureMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Feature Maintenance"
      description="Manage product features with complete CRUD operations"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search features..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <AddFeatureButton
          onClick={handleAddFeature}
          disabled={!selectedProductId}
        />
      }
    >
      {/* Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 3,
          height: "100%",
        }}
      >
        {/* Sidebar: Product Selector */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <ProductSelector
            products={productsWithFeatures}
            selectedProductId={selectedProductId}
            onSelectProduct={setSelectedProductId}
          />
        </Box>

        {/* Main: Features List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Mobile Product Selector */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <ProductSelector
              products={productsWithFeatures}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
            />
          </Box>

          {/* Features List */}
          {filteredAndSortedFeatures.length === 0 ? (
            <FeatureMaintenanceEmptyState
              featuresCount={selectedProduct?.features.length ?? 0}
              searchQuery={searchQuery}
            />
          ) : (
            <ProductFeaturesList
              product={selectedProduct}
              features={filteredAndSortedFeatures}
              onEditFeature={handleEditFeature}
              onDeleteFeature={handleDeleteFeature}
              isDeleting={isDeleting}
            />
          )}
        </Box>
      </Box>

      {/* Edit Dialog */}
      <FeatureEditDialog
        open={openDialog}
        editing={editingState?.feature !== undefined}
        feature={editingState?.feature || null}
        selectedProductName={selectedProduct?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSaveFeature}
        onFeatureChange={(feature: Feature) => {
          if (editingState) {
            setEditingState({
              ...editingState,
              feature,
            });
          }
        }}
      />
    </PageLayout>
  );
}

export default FeatureMaintenancePage;

