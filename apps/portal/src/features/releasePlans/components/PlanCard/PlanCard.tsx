import { useImperativeHandle, forwardRef, lazy, Suspense } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { Plan } from "../../types";
import { usePlanCard } from "../../hooks";
import { PlanCardLayout } from "./components/PlanCardLayout";
import { PlanCardContent } from "./components/PlanCardContent";
import { ErrorSnackbar } from "./components/ErrorSnackbar";
import { ErrorBoundary } from "../../../../utils/logging/ErrorBoundary";
import { useComponentLogger } from "../../../../utils/logging/simpleLogging";

// ⚡ OPTIMIZATION: Lazy load heavy components
// PlanRightPanel contains GanttChart which is a heavy component
const PlanRightPanel = lazy(
  () =>
    import(
      /* webpackChunkName: "plan-right-panel" */
      /* webpackPrefetch: true */
      "../Plan/PlanRightPanel"
    )
      .then((module) => {
        console.log("[PlanCard] PlanRightPanel loaded successfully:", module);
        return module;
      })
      .catch((error) => {
        console.error("[PlanCard] Failed to load PlanRightPanel:", error);
        // Return a fallback component that shows an error message
        return {
          default: () => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                p: 3,
                color: "error.main",
              }}
            >
              Error loading timeline. Please refresh the page.
            </Box>
          ),
        };
      })
);

// PlanCardDialogs contains multiple dialog components - lazy load them
// Note: PlanCardDialogs uses named export, so we wrap it
const PlanCardDialogs = lazy(
  () =>
    import(
      /* webpackChunkName: "plan-card-dialogs" */
      /* webpackPrefetch: true */
      "./components/PlanCardDialogs"
    ).then((module) => ({ default: module.PlanCardDialogs }))
);
import {
  useUpdatePlan,
  useUpdateFeature,
  useProducts,
  useUpdateProduct,
} from "../../../../api/hooks";
import { useQueryClient } from "@tanstack/react-query";

// New hooks for SoC
import { usePlanCardState } from "./hooks/usePlanCardState";
import { usePlanCardHandlers } from "./hooks/usePlanCardHandlers";
import { usePlanCardChanges } from "./hooks/usePlanCardChanges";
import { usePlanCardReferences } from "./hooks/usePlanCardReferences";
import { usePlanCardMilestones } from "./hooks/usePlanCardMilestones";
import { usePlanCardReferenceDialogs } from "./hooks/usePlanCardReferenceDialogs";
import { usePlanCardSave } from "./hooks/usePlanCardSave";
import { usePlanCardLifecycle } from "./hooks/usePlanCardLifecycle";
import { usePlanCardPhaseEdit } from "./hooks/usePlanCardPhaseEdit";
import { usePlanCardReferenceSave } from "./hooks/usePlanCardReferenceSave";

export type PlanCardProps = {
  readonly plan: Plan;
};

export type PlanCardHandle = {
  saveAll: () => Promise<void>;
  hasPendingChanges: () => boolean;
};

const PlanCard = forwardRef<PlanCardHandle, PlanCardProps>(function PlanCard(
  { plan },
  ref
) {
  const log = useComponentLogger("PlanCard");

  // API hooks for updating plan, features, and products/components
  const updatePlanMutation = useUpdatePlan();
  const updateFeatureMutation = useUpdateFeature();
  const updateProductMutation = useUpdateProduct();

  const { metadata: originalMetadata, tasks } = plan;
  const queryClient = useQueryClient();

  // ⚡ OPTIMIZATION: Only fetch products when productId exists and we need them
  // This prevents unnecessary API calls on mount
  const { data: products = [] } = useProducts();
  // Note: useProducts doesn't support enabled flag, but we can rely on React Query cache
  // Products are likely already cached from other parts of the app

  // State management hook
  const {
    localMetadata,
    setLocalMetadata,
    isEditingRef,
    scrollToDateFn,
    setScrollToDateFn,
    errorSnackbar,
    setErrorSnackbar,
  } = usePlanCardState(plan);

  const metadata = localMetadata;

  // ⭐ Clean Architecture - Business logic separated in custom hook
  const {
    leftPercent,
    expanded,
    phaseOpen,
    editOpen,
    editingPhase,
    handleToggleExpanded,
    handleLeftPercentChange,
    openEdit,
    handleAddPhase,
    handlePhaseRangeChange,
    setPhaseOpen,
    setEditOpen,
  } = usePlanCard(plan, updatePlanMutation, localMetadata);

  // ⚡ OPTIMIZATION: Don't fetch features eagerly - they're loaded by PlanProductTab when needed
  // Get features from cache if available, otherwise empty array
  // This prevents unnecessary API calls on mount
  // Features will be fetched when user navigates to Product tab (PlanProductTab)
  // When saving, if features are not in cache, they'll be fetched on-demand
  const allProductFeatures =
    (originalMetadata?.productId
      ? queryClient.getQueryData<Array<{ id: string }>>([
          "features",
          "list",
          originalMetadata.productId,
        ])
      : null) || [];

  // Handlers hook
  const {
    handleToggleExpandedOptimized,
    handleLeftPercentChangeOptimized,
    handleAddPhaseOptimized,
    handlePhaseRangeChangeOptimized,
    handleReorderPhases,
    openEditOptimized,
    handleNameChange,
    handleProductChange,
    handleDescriptionChange,
    handleStatusChange,
    handleITOwnerChange,
    handleStartDateChange,
    handleEndDateChange,
    handleFeatureIdsChange,
    handleComponentsChange,
    handleCalendarIdsChange,
    handleIndicatorIdsChange,
    handleTeamIdsChange,
    handleLeadIdChange,
  } = usePlanCardHandlers({
    plan,
    localMetadata,
    setLocalMetadata,
    handleToggleExpanded,
    expanded,
    handleLeftPercentChange,
    handleAddPhase,
    handlePhaseRangeChange,
    openEdit,
    log,
  });

  // Changes detection hook
  const { hasPendingChanges, hasTimelineChanges, stableHasTabChanges } =
    usePlanCardChanges(originalMetadata, localMetadata);

  // References hook
  const { consolidatedReferences, handleReferencesChange } =
    usePlanCardReferences(metadata, setLocalMetadata);

  // Milestones hook
  const {
    milestoneDialogOpen,
    selectedMilestoneDate,
    editingMilestone,
    handleMilestoneAdd,
    handleMilestoneUpdate,
    handleMilestoneDelete,
    handleMilestoneSave,
    handleMilestoneDialogClose,
  } = usePlanCardMilestones(metadata, setLocalMetadata);

  // Reference dialogs hook
  const {
    referenceDialogOpen,
    isCreatingReference,
    referenceForDialog,
    handleAddCellComment,
    handleAddCellFile,
    handleAddCellLink,
    handleToggleCellMilestone,
    handleReferenceDialogClose,
  } = usePlanCardReferenceDialogs(metadata);

  // Reference save hook
  const { handleSaveReference } = usePlanCardReferenceSave(
    metadata,
    setLocalMetadata,
    handleReferenceDialogClose
  );

  // Phase edit hook
  const { handlePhaseSave } = usePlanCardPhaseEdit(
    metadata,
    setLocalMetadata,
    setEditOpen,
    isEditingRef
  );

  // Save operations hook
  const { handleSaveTab, handleSaveTimeline, handleSaveAll } = usePlanCardSave({
    plan,
    metadata: localMetadata,
    originalMetadata,
    localMetadata,
    setLocalMetadata,
    updatePlanMutation: updatePlanMutation as {
      mutateAsync: (params: { id: string; data: unknown }) => Promise<unknown>;
      isPending: boolean;
    } & Record<string, unknown>,
    updateFeatureMutation: updateFeatureMutation as {
      mutateAsync: (params: {
        id: string;
        data: { status: "assigned" };
      }) => Promise<unknown>;
    } & Record<string, unknown>,
    updateProductMutation: updateProductMutation as {
      mutateAsync: (params: {
        id: string;
        data: {
          components: Array<{
            id: string;
            name: string;
            type: string;
            componentTypeId?: string;
            currentVersion: string;
            previousVersion: string;
          }>;
          updatedAt: string;
          _partialUpdate: boolean;
        };
      }) => Promise<unknown>;
    } & Record<string, unknown>,
    products,
    allProductFeatures,
    setErrorSnackbar,
  });

  // Lifecycle hook
  usePlanCardLifecycle(plan, tasks);

  // Expose saveAll and hasPendingChanges via ref
  useImperativeHandle(
    ref,
    () => ({
      saveAll: handleSaveAll,
      hasPendingChanges,
    }),
    [handleSaveAll, hasPendingChanges]
  );

  // ⭐ Error Boundary with automatic error logging and recovery UI
  const handleError = (error: Error) => {
    log.error("PlanCard crashed", error);
  };

  const renderFallback = (
    <div className="p-4 border border-red-300 bg-red-50 rounded">
      <h3 className="text-red-800 font-semibold">Plan Card Error</h3>
      <p className="text-red-600">
        There was an error loading plan "{localMetadata.name}"
      </p>
      <button
        onClick={() => globalThis.location.reload()}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reload Page
      </button>
    </div>
  );

  return (
    <ErrorBoundary onError={handleError} fallback={renderFallback}>
      <PlanCardLayout
        plan={plan}
        expanded={expanded}
        onToggleExpanded={handleToggleExpandedOptimized}
        leftPercent={leftPercent}
        onLeftPercentChange={handleLeftPercentChangeOptimized}
        left={
          <PlanCardContent
            plan={plan}
            metadata={metadata}
            originalMetadata={originalMetadata}
            expanded={expanded}
            leftPercent={leftPercent}
            tasks={tasks}
            consolidatedReferences={consolidatedReferences}
            scrollToDateFn={scrollToDateFn}
            stableHasTabChanges={stableHasTabChanges}
            hasTimelineChanges={hasTimelineChanges}
            isSaving={updatePlanMutation.isPending}
            handleToggleExpandedOptimized={handleToggleExpandedOptimized}
            handleLeftPercentChangeOptimized={handleLeftPercentChangeOptimized}
            handleNameChange={handleNameChange}
            handleProductChange={handleProductChange}
            handleDescriptionChange={handleDescriptionChange}
            handleStatusChange={handleStatusChange}
            handleITOwnerChange={handleITOwnerChange}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            handleFeatureIdsChange={handleFeatureIdsChange}
            handleComponentsChange={handleComponentsChange}
            handleCalendarIdsChange={handleCalendarIdsChange}
            handleIndicatorIdsChange={handleIndicatorIdsChange}
            handleTeamIdsChange={handleTeamIdsChange}
            handleLeadIdChange={handleLeadIdChange}
            handleReferencesChange={handleReferencesChange}
            handleSaveTab={handleSaveTab}
            handleMilestoneAdd={handleMilestoneAdd}
            handleMilestoneUpdate={handleMilestoneUpdate}
            handleAddCellComment={handleAddCellComment}
            handleAddCellFile={handleAddCellFile}
            handleAddCellLink={handleAddCellLink}
            handleToggleCellMilestone={handleToggleCellMilestone}
            setScrollToDateFn={setScrollToDateFn}
            handleSaveTimeline={handleSaveTimeline}
            openEditOptimized={openEditOptimized}
            handlePhaseRangeChangeOptimized={handlePhaseRangeChangeOptimized}
            handleReorderPhases={handleReorderPhases}
            setPhaseOpen={setPhaseOpen}
          />
        }
        right={
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 400,
                  gap: 2,
                }}
              >
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">
                  Cargando timeline...
                </Typography>
              </Box>
            }
          >
            <PlanRightPanel
              startDate={metadata.startDate}
              endDate={metadata.endDate}
              tasks={tasks}
              phases={metadata.phases}
              calendarIds={metadata.calendarIds}
              milestones={metadata.milestones}
              references={metadata.references}
              onMilestoneAdd={handleMilestoneAdd}
              onMilestoneUpdate={handleMilestoneUpdate}
              onAddPhase={() => setPhaseOpen(true)}
              onEditPhase={openEditOptimized}
              onPhaseRangeChange={handlePhaseRangeChangeOptimized}
              onReorderPhases={handleReorderPhases}
              onAddCellComment={handleAddCellComment}
              onAddCellFile={handleAddCellFile}
              onAddCellLink={handleAddCellLink}
              onToggleCellMilestone={handleToggleCellMilestone}
              onScrollToDateReady={setScrollToDateFn}
              onSaveTimeline={handleSaveTimeline}
              hasTimelineChanges={hasTimelineChanges}
              isSavingTimeline={updatePlanMutation.isPending}
            />
          </Suspense>
        }
      />

      {/* ⚡ OPTIMIZATION: Lazy load dialogs - only load when needed */}
      <Suspense fallback={null}>
        <PlanCardDialogs
          planId={plan.id}
          phaseOpen={phaseOpen}
          setPhaseOpen={setPhaseOpen}
          editOpen={editOpen}
          editingPhase={editingPhase}
          setEditOpen={setEditOpen}
          handleAddPhaseOptimized={handleAddPhaseOptimized}
          onPhaseSave={handlePhaseSave}
          handleSaveTimeline={handleSaveTimeline}
          setLocalMetadata={setLocalMetadata}
          isEditingRef={isEditingRef}
          metadata={metadata}
          originalMetadata={originalMetadata}
          milestoneDialogOpen={milestoneDialogOpen}
          selectedMilestoneDate={selectedMilestoneDate}
          editingMilestone={editingMilestone}
          handleMilestoneSave={handleMilestoneSave}
          handleMilestoneDelete={handleMilestoneDelete}
          handleMilestoneDialogClose={handleMilestoneDialogClose}
          referenceDialogOpen={referenceDialogOpen}
          referenceForDialog={referenceForDialog}
          isCreatingReference={isCreatingReference}
          handleSaveReference={handleSaveReference}
          handleReferenceDialogClose={handleReferenceDialogClose}
        />
      </Suspense>

      <ErrorSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        onClose={() => setErrorSnackbar({ open: false, message: "" })}
      />
    </ErrorBoundary>
  );
});

export default PlanCard;
