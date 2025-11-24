import { useImperativeHandle, forwardRef } from "react";
import type { Plan } from "../../types";
import { usePlanCard } from "../../hooks";
import { PlanCardLayout } from "./components/PlanCardLayout";
import { PlanCardContent } from "./components/PlanCardContent";
import { PlanCardDialogs } from "./components/PlanCardDialogs";
import PlanRightPanel from "../Plan/PlanRightPanel/PlanRightPanel";
import { ErrorSnackbar } from "./components/ErrorSnackbar";
import { ErrorBoundary } from "../../../../utils/logging/ErrorBoundary";
import { useComponentLogger } from "../../../../utils/logging/simpleLogging";
import {
  useUpdatePlan,
  useFeatures,
  useUpdateFeature,
  useProducts,
  useUpdateProduct,
} from "../../../../api/hooks";

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

  // Get products to access components for version updates
  const { data: products = [] } = useProducts();

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
  } = usePlanCard(plan, updatePlanMutation);

  const { metadata: originalMetadata, tasks } = plan;

  // Get all features for the product to update their status
  const { data: allProductFeatures = [] } = useFeatures(
    originalMetadata?.productId
  );

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

  // Handlers hook
  const {
    handleToggleExpandedOptimized,
    handleLeftPercentChangeOptimized,
    handleAddPhaseOptimized,
    handlePhaseRangeChangeOptimized,
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
            setPhaseOpen={setPhaseOpen}
          />
        }
        right={
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
            onAddCellComment={handleAddCellComment}
            onAddCellFile={handleAddCellFile}
            onAddCellLink={handleAddCellLink}
            onToggleCellMilestone={handleToggleCellMilestone}
            onScrollToDateReady={setScrollToDateFn}
            onSaveTimeline={handleSaveTimeline}
            hasTimelineChanges={hasTimelineChanges}
            isSavingTimeline={updatePlanMutation.isPending}
          />
        }
      />

      <PlanCardDialogs
        phaseOpen={phaseOpen}
        setPhaseOpen={setPhaseOpen}
        editOpen={editOpen}
        editingPhase={editingPhase}
        setEditOpen={setEditOpen}
        handleAddPhaseOptimized={handleAddPhaseOptimized}
        onPhaseSave={handlePhaseSave}
        isEditingRef={isEditingRef}
        metadata={metadata}
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

      <ErrorSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        onClose={() => setErrorSnackbar({ open: false, message: "" })}
      />
    </ErrorBoundary>
  );
});

export default PlanCard;
