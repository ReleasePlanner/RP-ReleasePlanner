/**
 * Country Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Countries
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useCountries,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
} from "@/api/hooks/useCountries";
import { CountryEditDialog } from "@/features/country/components";
import {
  useCountryMaintenanceState,
  useCountryMaintenanceData,
  useCountryMaintenanceHandlers,
} from "./hooks";
import {
  CountryMaintenanceLoadingState,
  CountryMaintenanceErrorState,
  CountryMaintenanceEmptyState,
  CountryMaintenanceList,
  AddCountryButton,
} from "./components";
import type { Country } from "@/api/services/countries.service";

export function CountryMaintenancePage() {
  // State management
  const {
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
  } = useCountryMaintenanceState();

  // API hooks
  const { data: countries = [], isLoading, error } = useCountries();
  const createMutation = useCreateCountry();
  const updateMutation = useUpdateCountry();
  const deleteMutation = useDeleteCountry();

  // Filter and sort data
  const { filteredAndSortedCountries } = useCountryMaintenanceData({
    countries,
    searchQuery,
    sortBy,
  });

  // Event handlers
  const {
    handleAddCountry,
    handleEditCountry,
    handleDeleteCountry,
    handleSave,
    handleCloseDialog,
  } = useCountryMaintenanceHandlers({
    countries,
    editingCountry,
    setEditingCountry,
    setOpenDialog,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "code", label: "Sort: Code" },
    { value: "region", label: "Sort: Region" },
  ];

  // Loading state
  if (isLoading) {
    return <CountryMaintenanceLoadingState />;
  }

  // Error state
  if (error) {
    return <CountryMaintenanceErrorState error={error} />;
  }

  return (
    <PageLayout
      title="Country Maintenance"
      description="Manage countries and regions"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search countries..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={<AddCountryButton onClick={handleAddCountry} />}
    >
      {/* Countries List */}
      {filteredAndSortedCountries.length === 0 ? (
        <CountryMaintenanceEmptyState
          countriesCount={countries.length}
          searchQuery={searchQuery}
        />
      ) : (
        <CountryMaintenanceList
          countries={filteredAndSortedCountries}
          isDeleting={deleteMutation.isPending}
          onEdit={handleEditCountry}
          onDelete={handleDeleteCountry}
        />
      )}

      {/* Edit Dialog */}
      <CountryEditDialog
        open={openDialog}
        country={editingCountry}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onCountryChange={(country: Country) => {
          setEditingCountry(country);
        }}
      />
    </PageLayout>
  );
}

export default CountryMaintenancePage;

