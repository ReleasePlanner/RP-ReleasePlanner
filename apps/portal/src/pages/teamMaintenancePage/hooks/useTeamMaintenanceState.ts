import { useState } from "react";
import type { ViewMode } from "@/components";
import type { Team } from "@/api/services/teams.service";

/**
 * Hook for managing TeamMaintenancePage state
 */
export function useTeamMaintenanceState() {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingTeam,
    setEditingTeam,
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

