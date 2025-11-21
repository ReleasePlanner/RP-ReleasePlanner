import { useState } from "react";
import type { ViewMode } from "@/components";
import type { Feature } from "@/features/feature/types";

interface EditingState {
  productId: string;
  feature?: Feature;
}

/**
 * Hook for managing FeatureMaintenancePage state
 */
export function useFeatureMaintenanceState() {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  return {
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
  };
}

