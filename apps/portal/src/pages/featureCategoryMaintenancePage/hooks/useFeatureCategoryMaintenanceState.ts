import { useState } from "react";
import type { ViewMode } from "@/components";
import type { FeatureCategory } from "@/api/services/featureCategories.service";

/**
 * Hook for managing FeatureCategoryMaintenancePage state
 */
export function useFeatureCategoryMaintenanceState() {
  const [editingCategory, setEditingCategory] = useState<FeatureCategory | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
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
  };
}

