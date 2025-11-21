import { useState } from "react";
import type { ViewMode } from "@/components";
import type { Country } from "@/api/services/countries.service";

/**
 * Hook for managing CountryMaintenancePage state
 */
export function useCountryMaintenanceState() {
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    editingCountry,
    setEditingCountry,
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

