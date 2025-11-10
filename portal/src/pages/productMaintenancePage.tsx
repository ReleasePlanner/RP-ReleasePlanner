/**
 * Product Maintenance Page
 *
 * Main page for managing products and their components
 */

import { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { type Product, type ComponentVersion } from "@/features/product/types";
import {
  ProductCard,
  ComponentEditDialog,
  ProductToolbar,
  type ViewMode,
  type SortBy,
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
  const [sortBy, setSortBy] = useState<SortBy>("name");
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            color: "text.primary",
          }}
        >
          Product Maintenance
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Manage products and their component versions
        </Typography>
      </Box>

      {/* Toolbar with controls */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
          pb: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <ProductToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{
            ml: "auto",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Products Grid/List */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid"
              ? {
                  xs: "1fr",
                  sm: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(2, 1fr)",
                }
              : "1fr",
          gap: 3,
          pb: 4,
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
    </Box>
  );
}
