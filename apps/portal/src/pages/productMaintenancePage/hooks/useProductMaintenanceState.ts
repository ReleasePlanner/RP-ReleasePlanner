import { useState } from "react";
import type { ViewMode } from "@/components";
import type {
  Product,
  ComponentVersion,
} from "@/api/services/products.service";

interface EditingProduct {
  product: Product;
  component?: ComponentVersion;
}

/**
 * Hook for managing ProductMaintenancePage state
 */
export function useProductMaintenanceState() {
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
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
  };
}

