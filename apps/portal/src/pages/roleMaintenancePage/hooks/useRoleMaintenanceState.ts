import { useState } from "react";
import type { ViewMode } from "@/components";
import type { Role } from "@/api/services/roles.service";

/**
 * Hook for managing RoleMaintenancePage state
 */
export function useRoleMaintenanceState() {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingRole,
    setEditingRole,
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

