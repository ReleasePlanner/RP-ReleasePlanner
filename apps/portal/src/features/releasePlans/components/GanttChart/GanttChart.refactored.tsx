import { useCallback } from "react";
import { GanttChartAppMode } from "./components/GanttChartAppMode";
import { GanttChartNormalMode } from "./components/GanttChartNormalMode";
import { useGanttChartLogic } from "./hooks/useGanttChartLogic";
import type {
  PlanTask,
  PlanPhase,
  PlanReference,
  PlanMilestone,
} from "../types";

export type GanttChartProps = {
  readonly startDate: string;
  readonly endDate: string;
  readonly tasks: PlanTask[];
  readonly phases?: PlanPhase[];
  readonly calendarIds?: string[];
  readonly milestones?: PlanMilestone[];
  readonly onMilestoneAdd?: (milestone: PlanMilestone) => void;
  readonly onMilestoneUpdate?: (milestone: PlanMilestone) => void;
  readonly onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  readonly onAddPhase?: () => void;
  readonly onEditPhase?: (id: string) => void;
  readonly onAutoGenerate?: () => void;
  readonly hideMainCalendar?: boolean;
  readonly references?: PlanReference[];
  readonly milestoneReferences?: PlanReference[];
  readonly onAddCellComment?: (phaseId: string, date: string) => void;
  readonly onAddCellFile?: (phaseId: string, date: string) => void;
  readonly onAddCellLink?: (phaseId: string, date: string) => void;
  readonly onToggleCellMilestone?: (phaseId: string, date: string) => void;
  readonly onScrollToDateReady?: (scrollToDate: (date: string) => void) => void;
  readonly onSaveTimeline?: () => void;
  readonly hasTimelineChanges?: boolean;
  readonly isSavingTimeline?: boolean;
  readonly onReorderPhases?: (reorderedPhases: PlanPhase[]) => void;
};

/**
 * Main Gantt Chart component
 * Refactored to use composition with smaller, focused components
 * Reduces complexity and improves maintainability
 */
export default function GanttChart({
  startDate,
  endDate,
  tasks,
  phases = [],
  calendarIds = [],
  milestones = [],
  onMilestoneAdd,
  onMilestoneUpdate,
  onPhaseRangeChange,
  onAddPhase,
  onEditPhase,
  onAutoGenerate,
  hideMainCalendar,
  references = [],
  milestoneReferences = [],
  onAddCellComment,
  onAddCellFile,
  onAddCellLink,
  onToggleCellMilestone,
  onScrollToDateReady,
  onSaveTimeline,
  hasTimelineChanges = false,
  isSavingTimeline = false,
  onReorderPhases,
}: GanttChartProps) {
  // Extract all shared logic into a custom hook
  const logic = useGanttChartLogic({
    startDate,
    endDate,
    tasks,
    phases,
    calendarIds,
    references,
    milestoneReferences,
    onPhaseRangeChange,
    onScrollToDateReady,
  });

  // Handle day click for milestones
  const handleDayClick = useCallback(
    (date: string) => {
      const existingMilestone = milestones.find((m) => m.date === date);

      if (existingMilestone) {
        if (onMilestoneUpdate) {
          // Could open edit dialog here
        }
      } else {
        if (onMilestoneAdd) {
          const newMilestone: PlanMilestone = {
            id: `milestone-${Date.now()}`,
            date,
            name: `Milestone ${date}`,
          };
          onMilestoneAdd(newMilestone);
        }
      }
    },
    [milestones, onMilestoneAdd, onMilestoneUpdate]
  );

  // Render appropriate mode based on hideMainCalendar prop
  if (hideMainCalendar) {
    return (
      <GanttChartAppMode
        logic={logic}
        phases={phases}
        tasks={tasks}
        milestones={milestones}
        references={references}
        onAddPhase={onAddPhase}
        onEditPhase={onEditPhase}
        onAutoGenerate={onAutoGenerate}
        onAddCellComment={onAddCellComment}
        onAddCellFile={onAddCellFile}
        onAddCellLink={onAddCellLink}
        onToggleCellMilestone={onToggleCellMilestone}
        onSaveTimeline={onSaveTimeline}
        hasTimelineChanges={hasTimelineChanges}
        isSavingTimeline={isSavingTimeline}
        handleDayClick={handleDayClick}
      />
    );
  }

  return (
    <GanttChartNormalMode
      logic={logic}
      phases={phases}
      tasks={tasks}
      milestones={milestones}
      references={references}
      onAddPhase={onAddPhase}
      onEditPhase={onEditPhase}
      onAutoGenerate={onAutoGenerate}
      onPhaseRangeChange={onPhaseRangeChange}
      onAddCellComment={onAddCellComment}
      onAddCellFile={onAddCellFile}
      onAddCellLink={onAddCellLink}
      onToggleCellMilestone={onToggleCellMilestone}
      onReorderPhases={onReorderPhases}
      handleDayClick={handleDayClick}
    />
  );
}

