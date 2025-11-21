/**
 * Release Planner Page
 *
 * Main page for managing and visualizing release plans
 * Refactored with Separation of Concerns (SoC)
 */

import { PageLayout } from "@/components";
import AddPlanDialog from "@/features/releasePlans/components/AddPlanDialog";
import { useAppDispatch } from "@/store/hooks";
import {
  usePlans,
  useCreatePlan,
  useDeletePlan,
  useBasePhases,
} from "@/api/hooks";
import {
  useReleasePlannerState,
  useReleasePlannerData,
  useReleasePlannerHandlers,
  useReleasePlannerDebounce,
  useReleasePlannerExpandedStates,
  useReleasePlannerPlans,
} from "./hooks";
import {
  ReleasePlannerLoadingState,
  ReleasePlannerErrorState,
  ReleasePlannerEmptyState,
  ReleasePlannerToolbar,
  ReleasePlannerEmptyResults,
  ReleasePlannerPlansList,
  ReleasePlannerPlansGrid,
  ReleasePlannerDeleteDialog,
  ReleasePlannerContextMenu,
  ReleasePlannerSnackbar,
  ReleasePlannerResultsCount,
} from "./components";

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "name", label: "Sort: Name" },
  { value: "startDate", label: "Sort: Start Date" },
  { value: "endDate", label: "Sort: End Date" },
  { value: "status", label: "Sort: Status" },
  { value: "owner", label: "Sort: Owner" },
];

export default function ReleasePlanner() {
  // API hooks
  const {
    data: apiPlans = [],
    isLoading: isLoadingPlans,
    error: plansError,
  } = usePlans();
  const {
    data: basePhases = [],
    isLoading: isLoadingPhases,
    error: phasesError,
  } = useBasePhases();
  const createMutation = useCreatePlan();
  const deleteMutation = useDeletePlan();

  const isLoading = isLoadingPlans || isLoadingPhases;
  const error = plansError || phasesError;
  const dispatch = useAppDispatch();

  // State management
  const {
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
  } = useReleasePlannerState();

  // Convert API plans to local format
  const plans = useReleasePlannerPlans({
    apiPlans,
    basePhases,
  });

  // Debounce search query
  useReleasePlannerDebounce({
    searchQuery,
    setDebouncedSearchQuery,
  });

  // Filter and sort plans
  const { filteredAndSortedPlans } = useReleasePlannerData({
    plans,
    debouncedSearchQuery,
    statusFilter,
    sortBy,
  });

  // Sync expanded states with Redux
  const expandedStates = useReleasePlannerExpandedStates({
    localExpandedStates,
    setLocalExpandedStates,
  });

  // Event handlers
  const {
    handleAddButtonClick,
    handleDialogClose,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleContextMenu,
    handleCloseContextMenu,
    handleCopyPlanId,
    handleCopyPlanIdDirect,
    handleDialogSubmit,
    handleExpandAll,
    handleCollapseAll,
    handlePlanToggle,
    getStatusChipProps,
  } = useReleasePlannerHandlers({
    dialogOpen,
    deleteDialogOpen,
    planToDelete,
    contextMenu,
    planForContextMenu,
    snackbar,
    viewMode,
    sortBy,
    searchQuery,
    statusFilter,
    showFilters,
    localExpandedStates,
    setDialogOpen,
    setDeleteDialogOpen,
    setPlanToDelete,
    setContextMenu,
    setPlanForContextMenu,
    setSnackbar,
    setViewMode,
    setSortBy,
    setSearchQuery,
    setStatusFilter,
    setShowFilters,
    setLocalExpandedStates,
    plans,
    deleteMutation,
    createMutation,
    basePhases,
    dispatch,
  });

  // Loading state
  if (isLoading) {
    return <ReleasePlannerLoadingState />;
  }

  // Error state
  if (error) {
    return (
      <ReleasePlannerErrorState
        error={error}
        dialogOpen={dialogOpen}
        onDialogClose={handleDialogClose}
        onDialogSubmit={handleDialogSubmit}
        onAddButtonClick={handleAddButtonClick}
      />
    );
  }

  // Empty state
  if (!plans.length) {
    return (
      <ReleasePlannerEmptyState
        dialogOpen={dialogOpen}
        onDialogClose={handleDialogClose}
        onDialogSubmit={handleDialogSubmit}
        onAddButtonClick={handleAddButtonClick}
      />
    );
  }

  return (
    <PageLayout
      title="Release Planner"
      description="Manage and visualize your release plans"
      toolbar={
        <ReleasePlannerToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          onAddPlan={handleAddButtonClick}
          sortOptions={SORT_OPTIONS}
        />
      }
    >
      {/* Results count */}
      <ReleasePlannerResultsCount
        filteredCount={filteredAndSortedPlans.length}
        totalCount={plans.length}
      />

      {/* Plans List/Grid */}
      {(() => {
        if (filteredAndSortedPlans.length === 0) {
          return (
            <ReleasePlannerEmptyResults
              plansCount={plans.length}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          );
        }

        if (viewMode === "list") {
          return (
            <ReleasePlannerPlansList
              plans={filteredAndSortedPlans}
              localExpandedStates={localExpandedStates}
              expandedStates={expandedStates}
              onToggle={handlePlanToggle}
              onDelete={handleDeleteClick}
              onCopyId={handleCopyPlanIdDirect}
              onContextMenu={handleContextMenu}
              getStatusChipProps={getStatusChipProps}
            />
          );
        }

        return <ReleasePlannerPlansGrid plans={filteredAndSortedPlans} />;
      })()}

      {/* Dialogs */}
      <AddPlanDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />

      <ReleasePlannerDeleteDialog
        open={deleteDialogOpen}
        planToDelete={planToDelete}
        isPending={deleteMutation.isPending}
        isError={deleteMutation.isError}
        error={deleteMutation.error}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        onResetError={() => deleteMutation.reset()}
        getStatusChipProps={getStatusChipProps}
      />

      {/* Context Menu */}
      <ReleasePlannerContextMenu
        open={contextMenu !== null}
        anchorPosition={
          contextMenu === null
            ? undefined
            : { top: contextMenu.mouseY, left: contextMenu.mouseX }
        }
        onClose={handleCloseContextMenu}
        onCopyPlanId={handleCopyPlanId}
      />

      {/* Snackbar */}
      <ReleasePlannerSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </PageLayout>
  );
}
