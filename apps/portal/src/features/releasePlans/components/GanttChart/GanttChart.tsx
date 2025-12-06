import { GanttChartAppMode } from "./components/GanttChartAppMode";
import { GanttChartNormalMode } from "./components/GanttChartNormalMode";
import { useGanttChartLogic } from "./hooks/useGanttChartLogic";
import { useHandleDayClick } from "./hooks/useHandleDayClick";
import type { GanttChartProps } from "./types";

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
}: Readonly<GanttChartProps>) {
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

  const handleDayClick = useHandleDayClick(
    milestones,
    onMilestoneAdd,
    onMilestoneUpdate
  );

  const commonProps = {
    logic,
    phases,
    tasks,
    milestones,
    references,
    onAddPhase,
    onEditPhase,
    onAutoGenerate,
    onAddCellComment,
    onAddCellFile,
    onAddCellLink,
    onToggleCellMilestone,
    handleDayClick,
  };

  if (hideMainCalendar) {
    return (
      <GanttChartAppMode
        {...commonProps}
        onSaveTimeline={onSaveTimeline}
        hasTimelineChanges={hasTimelineChanges}
        isSavingTimeline={isSavingTimeline}
      />
    );
  }

  return (
    <GanttChartNormalMode
      {...commonProps}
      onPhaseRangeChange={onPhaseRangeChange}
    />
  );
}

export type { GanttChartProps } from "./types";
