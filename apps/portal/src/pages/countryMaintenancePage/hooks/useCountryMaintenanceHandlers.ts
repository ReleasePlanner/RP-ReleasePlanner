import { useCallback } from "react";
import type { Country } from "@/api/services/countries.service";

interface UseCountryMaintenanceHandlersProps {
  countries: Country[];
  editingCountry: Country | null;
  setEditingCountry: (country: Country | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: {
      name: string;
      code: string;
      isoCode: string;
      region: string;
    }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: {
        name: string;
        code: string;
        isoCode: string;
        region: string;
      };
    }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

/**
 * Hook for managing CountryMaintenancePage event handlers
 */
export function useCountryMaintenanceHandlers({
  countries,
  editingCountry,
  setEditingCountry,
  setOpenDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseCountryMaintenanceHandlersProps) {
  const handleAddCountry = useCallback(() => {
    setEditingCountry({
      id: `country-${Date.now()}`,
      name: "",
      code: "",
      isoCode: "",
      region: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Country);
    setOpenDialog(true);
  }, [setEditingCountry, setOpenDialog]);

  const handleEditCountry = useCallback(
    (country: Country) => {
      setEditingCountry(country);
      setOpenDialog(true);
    },
    [setEditingCountry, setOpenDialog]
  );

  const handleDeleteCountry = useCallback(
    async (countryId: string) => {
      if (
        !globalThis.confirm("Are you sure you want to delete this country?")
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(countryId);
      } catch (error: unknown) {
        console.error("Error deleting country:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting country. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const handleSave = useCallback(async () => {
    if (!editingCountry) return;

    try {
      const existingCountry = countries.find((c) => c.id === editingCountry.id);
      if (existingCountry && !existingCountry.id.startsWith("country-")) {
        await updateMutation.mutateAsync({
          id: editingCountry.id,
          data: {
            name: editingCountry.name,
            code: editingCountry.code,
            isoCode: editingCountry.isoCode,
            region: editingCountry.region,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingCountry.name,
          code: editingCountry.code,
          isoCode: editingCountry.isoCode,
          region: editingCountry.region,
        });
      }
      setOpenDialog(false);
      setEditingCountry(null);
    } catch (error: unknown) {
      console.error("Error saving country:", error);
    }
  }, [
    editingCountry,
    countries,
    createMutation,
    updateMutation,
    setOpenDialog,
    setEditingCountry,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCountry(null);
  }, [setOpenDialog, setEditingCountry]);

  return {
    handleAddCountry,
    handleEditCountry,
    handleDeleteCountry,
    handleSave,
    handleCloseDialog,
  };
}

