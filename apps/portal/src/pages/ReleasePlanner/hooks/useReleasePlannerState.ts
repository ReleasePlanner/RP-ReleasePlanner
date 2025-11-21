import { useState } from "react";
import type { Plan as LocalPlan, PlanStatus } from "@/features/releasePlans/types";

type ViewMode = "grid" | "list";
type SortOption = "name" | "startDate" | "endDate" | "status" | "owner";
type FilterStatus = PlanStatus | "all";

/**
 * Hook for managing ReleasePlanner state
 */
export function useReleasePlannerState() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<LocalPlan | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [planForContextMenu, setPlanForContextMenu] = useState<LocalPlan | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  // View and filter state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [showFilters, setShowFilters] = useState(true);

  // Optimistic UI updates for expanded states
  const [localExpandedStates, setLocalExpandedStates] = useState<Record<string, boolean>>({});

  return {
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    planToDelete,
    setPlanToDelete,
    contextMenu,
    setContextMenu,
    planForContextMenu,
    setPlanForContextMenu,
    snackbar,
    setSnackbar,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    setDebouncedSearchQuery,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    localExpandedStates,
    setLocalExpandedStates,
  };
}

export type { ViewMode, SortOption, FilterStatus };

