import { useState } from "react";
import type { ViewMode } from "@/components";
import type { ITOwner } from "@/api/services/itOwners.service";

/**
 * Hook for managing ITOwnerMaintenancePage state
 */
export function useITOwnerMaintenanceState() {
  const [editingOwner, setEditingOwner] = useState<ITOwner | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingOwner,
    setEditingOwner,
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

