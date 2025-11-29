import { useState } from "react";
import type { ViewMode } from "@/components";
import type { RescheduleType } from "@/api/services/rescheduleTypes.service";

/**
 * Hook for managing RescheduleTypeMaintenancePage state
 */
export function useRescheduleTypeMaintenanceState() {
  const [editingRescheduleType, setEditingRescheduleType] = useState<RescheduleType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingRescheduleType,
    setEditingRescheduleType,
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

