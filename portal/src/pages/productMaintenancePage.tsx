/**
 * Product Maintenance Page
 *
 * Elegant, Material UI compliant page for managing products and their components
 */

import { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import { type Product, type ComponentVersion } from "@/features/product/types";
import {
  ProductCard,
  ComponentEditDialog,
} from "@/features/product/components";

/**
 * Mock data for products
 */
const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Release Planner",
    components: [
      {
        id: "comp-1",
        type: "web",
        currentVersion: "2.1.0",
        previousVersion: "2.0.5",
      },
      {
        id: "comp-2",
        type: "services",
        currentVersion: "1.5.0",
        previousVersion: "1.4.8",
      },
    ],
  },
  {
    id: "prod-2",
    name: "Analytics Platform",
    components: [
      {
        id: "comp-3",
        type: "web",
        currentVersion: "3.0.0",
        previousVersion: "2.9.5",
      },
      {
        id: "comp-4",
        type: "mobile",
        currentVersion: "1.2.0",
        previousVersion: "1.1.9",
      },
      {
        id: "comp-5",
        type: "services",
        currentVersion: "2.0.0",
        previousVersion: "1.9.2",
      },
    ],
  },
];

interface EditingProduct {
  product: Product;
  component?: ComponentVersion;
}

export function ProductMaintenancePage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      // For demo, sort by ID (would be by actual date in real app)
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const handleAddProduct = () => {
    setEditingProduct({
      product: { id: `prod-${Date.now()}`, name: "", components: [] },
    });
    setOpenDialog(true);
  };

  const handleEditComponent = (
    product: Product,
    component: ComponentVersion
  ) => {
    setSelectedProduct(product);
    setEditingProduct({ product, component });
    setOpenDialog(true);
  };

  const handleDeleteComponent = (productId: string, componentId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              components: p.components.filter((c) => c.id !== componentId),
            }
          : p
      )
    );
  };

  const handleAddComponent = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct({
      product,
      component: {
        id: `comp-${Date.now()}`,
        type: "web",
        currentVersion: "",
        previousVersion: "",
      },
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!editingProduct || !editingProduct.component) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct?.id
          ? {
              ...p,
              components: p.components.map((c) =>
                c.id === editingProduct.component?.id
                  ? editingProduct.component
                  : c
              ),
            }
          : p
      )
    );

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  const isEditing = editingProduct?.component !== undefined;

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "date", label: "Sort: Date" },
  ];

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
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Add Product
        </Button>
      }
    >
      {/* Products Grid/List */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid"
              ? {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(400px, 1fr))",
                  lg: "repeat(2, 1fr)",
                }
              : "1fr",
          gap: 3,
        }}
      >
        {filteredAndSortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEditComponent={handleEditComponent}
            onDeleteComponent={handleDeleteComponent}
            onAddComponent={handleAddComponent}
          />
        ))}
      </Box>

      {/* Edit Dialog */}
      <ComponentEditDialog
        open={openDialog}
        editing={isEditing}
        component={editingProduct?.component || null}
        selectedProductName={selectedProduct?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onComponentChange={(component) => {
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
