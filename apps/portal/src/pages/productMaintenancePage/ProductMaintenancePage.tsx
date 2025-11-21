/**
 * Product Maintenance Page
 *
 * Minimalist page for managing products and their component versions
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  ComponentEditDialog,
} from "@/features/product/components";
import { ProductEditDialog } from "@/features/product/components/ProductEditDialog";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/api/hooks";
import { useComponentTypes } from "@/api/hooks/useComponentTypes";
import type {
  Product,
  ComponentVersion,
} from "@/api/services/products.service";
import {
  useProductMaintenanceState,
  useProductMaintenanceData,
  useProductMaintenanceHandlers,
} from "./hooks";
import {
  ProductMaintenanceLoadingState,
  ProductMaintenanceErrorState,
  ProductMaintenanceEmptyState,
  ProductMaintenanceList,
  AddProductButton,
} from "./components";

/**
 * Helper function to check if a string is a valid UUID
 */
function isValidUUID(str: string | undefined): boolean {
  if (!str) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function ProductMaintenancePage() {
  // State management
  const {
    editingProduct,
    setEditingProduct,
    openDialog,
    setOpenDialog,
    openProductDialog,
    setOpenProductDialog,
    selectedProduct,
    setSelectedProduct,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useProductMaintenanceState();

  // API hooks
  const { data: products = [], isLoading, error } = useProducts();
  const { data: componentTypes = [] } = useComponentTypes();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Filter and sort data
  const { filteredAndSortedProducts } = useProductMaintenanceData({
    products,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleEditComponent,
    handleDeleteComponent,
    handleAddComponent,
    handleSaveProduct,
    handleSaveComponent,
    handleCloseDialog,
    handleCloseProductDialog,
  } = useProductMaintenanceHandlers({
    products,
    componentTypes,
    editingProduct,
    selectedProduct,
    setEditingProduct,
    setSelectedProduct,
    setOpenDialog,
    setOpenProductDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  // Determine if editing: component exists and has a valid UUID (from database)
  const isEditing =
    editingProduct?.component !== undefined &&
    editingProduct.component.id &&
    isValidUUID(editingProduct.component.id);

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "date", label: "Sort: Date" },
  ];

  // Loading state
  if (isLoading) {
    return <ProductMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <ProductMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Product Maintenance"
      description="Manage products and their component versions"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search products..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddProductButton onClick={handleAddProduct} />}
    >
      {/* Products List */}
      {filteredAndSortedProducts.length === 0 ? (
        <ProductMaintenanceEmptyState
          productsCount={products.length}
          searchQuery={searchQuery}
        />
      ) : (
        <ProductMaintenanceList
          products={filteredAndSortedProducts}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Product Edit Dialog */}
      <ProductEditDialog
        open={openProductDialog}
        product={editingProduct?.product || null}
        onClose={handleCloseProductDialog}
        onSave={handleSaveProduct}
        onProductChange={(product: Product) => {
          if (editingProduct) {
            setEditingProduct({ product });
          }
        }}
      />

      {/* Component Edit Dialog */}
      <ComponentEditDialog
        open={openDialog}
        editing={isEditing}
        component={editingProduct?.component || null}
        selectedProductName={selectedProduct?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSaveComponent}
        onComponentChange={(component: ComponentVersion) => {
          if (editingProduct) {
            setEditingProduct({
              ...editingProduct,
              component,
            });
          }
        }}
      />
    </PageLayout>
  );
}

export default ProductMaintenancePage;

