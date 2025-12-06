import type {
  PlanTask,
  PlanPhase,
  PlanReference,
  PlanMilestone,
} from "../../types";

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
};

