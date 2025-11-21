import { useState } from "react";
import type { ViewMode } from "@/components";
import type { ComponentType } from "@/api/services/componentTypes.service";

/**
 * Hook for managing ComponentTypeMaintenancePage state
 */
export function useComponentTypeMaintenanceState() {
  const [editingType, setEditingType] = useState<ComponentType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingType,
    setEditingType,
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

