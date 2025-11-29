import { useState } from "react";
import type { ViewMode } from "@/components";
import type { Talent } from "@/api/services/talents.service";

/**
 * Hook for managing TalentMaintenancePage state
 */
export function useTalentMaintenanceState() {
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingTalent,
    setEditingTalent,
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

