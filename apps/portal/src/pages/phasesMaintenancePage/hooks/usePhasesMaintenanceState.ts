import { useState } from "react";
import type { ViewMode } from "@/components";
import type { BasePhase } from "@/api/services/basePhases.service";

/**
 * Hook for managing PhasesMaintenancePage state
 */
export function usePhasesMaintenanceState() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState<BasePhase | null>(null);
  const [editingPhase, setEditingPhase] = useState<BasePhase | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<BasePhase>>({
    name: "",
    color: "#1976D2",
  });

  return {
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    phaseToDelete,
    setPhaseToDelete,
    editingPhase,
    setEditingPhase,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    formData,
    setFormData,
  };
}
