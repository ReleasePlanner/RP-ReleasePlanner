import { useState } from "react";
import type { ViewMode } from "@/components";
import type { Indicator } from "@/api/services/indicators.service";

/**
 * Hook for managing IndicatorMaintenancePage state
 */
export function useIndicatorMaintenanceState() {
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingIndicator,
    setEditingIndicator,
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

