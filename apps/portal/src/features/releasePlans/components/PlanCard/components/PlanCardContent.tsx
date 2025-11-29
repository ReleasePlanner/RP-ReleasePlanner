import { useState, useCallback } from "react";
import type { Plan } from "../../../types";
import PlanLeftPane from "../../Plan/PlanLeftPane/PlanLeftPane";
import type { PlanMilestone, PlanReference, PlanTask } from "../../../types";

export type PlanCardContentProps = {
  readonly plan: Plan;
  readonly metadata: Plan["metadata"];
  readonly originalMetadata: Plan["metadata"];
  readonly expanded: boolean;
  readonly leftPercent: number;
  readonly tasks: PlanTask[];
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
  readonly handleLeadIdChange: (leadId: string) => void;
  readonly handleStartDateChange: (date: string) => void;
  readonly handleEndDateChange: (date: string) => void;
  readonly handleFeatureIdsChange: (newFeatureIds: string[]) => void;
  readonly handleComponentsChange: (
    newComponents: Plan["metadata"]["components"]
  ) => void;
  readonly handleCalendarIdsChange: (newCalendarIds: string[]) => void;
  readonly handleIndicatorIdsChange: (newIndicatorIds: string[]) => void;
  readonly handleTeamIdsChange: (newTeamIds: string[]) => void;
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
  readonly handleSaveTimeline: (phasesOverride?: Plan["metadata"]["phases"]) => Promise<void>;
  readonly openEditOptimized: (phaseId: string) => void;
  readonly handlePhaseRangeChangeOptimized: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  readonly handleReorderPhases: (reorderedPhases: PlanPhase[]) => void;
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
  handleLeadIdChange,
  handleStartDateChange,
  handleEndDateChange,
  handleFeatureIdsChange,
  handleComponentsChange,
  handleCalendarIdsChange,
  handleIndicatorIdsChange,
  handleTeamIdsChange,
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
  handleReorderPhases,
  setPhaseOpen,
}: PlanCardContentProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  return (
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
      leadId={metadata.leadId}
      featureIds={metadata.featureIds}
      components={metadata.components}
      calendarIds={metadata.calendarIds}
      indicatorIds={metadata.indicatorIds}
      teamIds={(() => {
        const teamIdsValue = metadata.teamIds || [];
        console.log('[PlanCardContent] Passing teamIds to PlanLeftPane:', {
          metadataTeamIds: metadata.teamIds,
          teamIdsValue,
          teamIdsValueCount: teamIdsValue.length,
          teamIdsValueIsArray: Array.isArray(teamIdsValue),
        });
        return teamIdsValue;
      })()}
      references={consolidatedReferences}
      onNameChange={handleNameChange}
      onProductChange={handleProductChange}
      onDescriptionChange={handleDescriptionChange}
      onStatusChange={handleStatusChange}
      onITOwnerChange={handleITOwnerChange}
      onLeadIdChange={handleLeadIdChange}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onFeatureIdsChange={handleFeatureIdsChange}
      onComponentsChange={handleComponentsChange}
      onCalendarIdsChange={handleCalendarIdsChange}
      onIndicatorIdsChange={handleIndicatorIdsChange}
      onTeamIdsChange={handleTeamIdsChange}
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
      originalMetadata={originalMetadata}
      tabValue={tabValue}
      onTabChange={handleTabChange}
    />
  );
}
