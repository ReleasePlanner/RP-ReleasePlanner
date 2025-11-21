import { Box } from "@mui/material";
import type { Plan } from "../../../types";
import PlanLeftPane from "../../Plan/PlanLeftPane/PlanLeftPane";
import { GanttChart } from "../../GanttChart";
import type { PlanPhase, PlanMilestone, PlanReference } from "../../../types";

export type PlanCardContentProps = {
  readonly plan: Plan;
  readonly metadata: Plan["metadata"];
  readonly originalMetadata: Plan["metadata"];
  readonly expanded: boolean;
  readonly leftPercent: number;
  readonly tasks: unknown[];
  readonly consolidatedReferences: PlanReference[];
  readonly scrollToDateFn: ((date: string) => void) | null;
  readonly stableHasTabChanges: Record<number, boolean>;
  readonly hasTimelineChanges: boolean;
  readonly isSaving: boolean;
  // Handlers
  readonly handleToggleExpandedOptimized: () => void;
  readonly handleLeftPercentChangeOptimized: (percent: number) => void;
  readonly handleNameChange: (newName: string) => void;
  readonly handleProductChange: (productId: string) => void;
  readonly handleDescriptionChange: (description: string) => void;
  readonly handleStatusChange: (status: Plan["metadata"]["status"]) => void;
  readonly handleITOwnerChange: (itOwnerId: string) => void;
  readonly handleStartDateChange: (date: string) => void;
  readonly handleEndDateChange: (date: string) => void;
  readonly handleFeatureIdsChange: (newFeatureIds: string[]) => void;
  readonly handleComponentsChange: (newComponents: Plan["metadata"]["components"]) => void;
  readonly handleCalendarIdsChange: (newCalendarIds: string[]) => void;
  readonly handleReferencesChange: (newReferences: PlanReference[]) => void;
  readonly handleSaveTab: (tabIndex: number) => Promise<void>;
  // Gantt handlers
  readonly handleMilestoneAdd: (milestone: PlanMilestone) => void;
  readonly handleMilestoneUpdate: (milestone: PlanMilestone) => void;
  readonly handleAddCellComment: (phaseId: string, date: string) => void;
  readonly handleAddCellFile: (phaseId: string, date: string) => void;
  readonly handleAddCellLink: (phaseId: string, date: string) => void;
  readonly handleToggleCellMilestone: (phaseId: string, date: string) => void;
  readonly setScrollToDateFn: (fn: ((date: string) => void) | null) => void;
  readonly handleSaveTimeline: () => Promise<void>;
  readonly openEditOptimized: (phaseId: string) => void;
  readonly handlePhaseRangeChangeOptimized: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  readonly setPhaseOpen: (open: boolean) => void;
};

export function PlanCardContent({
  plan,
  metadata,
  originalMetadata,
  tasks,
  consolidatedReferences,
  scrollToDateFn,
  stableHasTabChanges,
  hasTimelineChanges,
  isSaving,
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
  handleReferencesChange,
  handleSaveTab,
  handleMilestoneAdd,
  handleMilestoneUpdate,
  handleAddCellComment,
  handleAddCellFile,
  handleAddCellLink,
  handleToggleCellMilestone,
  setScrollToDateFn,
  handleSaveTimeline,
  openEditOptimized,
  handlePhaseRangeChangeOptimized,
  setPhaseOpen,
}: PlanCardContentProps) {
  return (
    <>
      <PlanLeftPane
        name={metadata.name}
        owner={metadata.owner}
        startDate={metadata.startDate}
        endDate={metadata.endDate}
        id={metadata.id}
        description={metadata.description}
        status={metadata.status}
        productId={metadata.productId}
        originalProductId={originalMetadata.productId}
        itOwner={metadata.itOwner}
        featureIds={metadata.featureIds}
        onNameChange={handleNameChange}
        onProductChange={handleProductChange}
        onDescriptionChange={handleDescriptionChange}
        onStatusChange={handleStatusChange}
        onITOwnerChange={handleITOwnerChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFeatureIdsChange={handleFeatureIdsChange}
        components={metadata.components}
        onComponentsChange={handleComponentsChange}
        calendarIds={metadata.calendarIds}
        onCalendarIdsChange={handleCalendarIdsChange}
        references={consolidatedReferences}
        onReferencesChange={handleReferencesChange}
        onScrollToDate={
          scrollToDateFn
            ? (date: string) => {
                scrollToDateFn(date);
              }
            : undefined
        }
        onSaveTab={handleSaveTab}
        isSaving={isSaving}
        hasTabChanges={stableHasTabChanges}
        planUpdatedAt={plan.updatedAt}
        plan={plan}
      />
      <Box sx={{ position: "relative", height: "100%" }}>
        <GanttChart
          startDate={metadata.startDate}
          endDate={metadata.endDate}
          tasks={tasks}
          phases={metadata.phases}
          calendarIds={metadata.calendarIds}
          milestones={metadata.milestones}
          onMilestoneAdd={handleMilestoneAdd}
          onMilestoneUpdate={handleMilestoneUpdate}
          hideMainCalendar
          onAddPhase={() => setPhaseOpen(true)}
          onEditPhase={openEditOptimized}
          onPhaseRangeChange={handlePhaseRangeChangeOptimized}
          references={metadata.references}
          milestoneReferences={(metadata.references || []).filter(
            (ref) => ref.type === "milestone" && ref.date
          )}
          onAddCellComment={handleAddCellComment}
          onAddCellFile={handleAddCellFile}
          onAddCellLink={handleAddCellLink}
          onToggleCellMilestone={handleToggleCellMilestone}
          onScrollToDateReady={setScrollToDateFn}
          onSaveTimeline={handleSaveTimeline}
          hasTimelineChanges={hasTimelineChanges}
          isSavingTimeline={isSaving}
        />
      </Box>
    </>
  );
}

