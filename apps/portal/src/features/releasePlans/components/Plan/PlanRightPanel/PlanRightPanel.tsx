import { Box } from "@mui/material";
import { GanttChart } from "../../GanttChart";
import type {
  PlanPhase,
  PlanMilestone,
  PlanReference,
  PlanTask,
} from "../../../types";

export type PlanRightPanelProps = {
  readonly startDate: string;
  readonly endDate: string;
  readonly tasks: PlanTask[];
  readonly phases?: PlanPhase[];
  readonly calendarIds?: string[];
  readonly milestones?: PlanMilestone[];
  readonly references?: PlanReference[];
  readonly onMilestoneAdd?: (milestone: PlanMilestone) => void;
  readonly onMilestoneUpdate?: (milestone: PlanMilestone) => void;
  readonly onAddPhase?: () => void;
  readonly onEditPhase?: (phaseId: string) => void;
  readonly onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  readonly onAddCellComment?: (phaseId: string, date: string) => void;
  readonly onAddCellFile?: (phaseId: string, date: string) => void;
  readonly onAddCellLink?: (phaseId: string, date: string) => void;
  readonly onToggleCellMilestone?: (phaseId: string, date: string) => void;
  readonly onScrollToDateReady?: (fn: ((date: string) => void) | null) => void;
  readonly onSaveTimeline?: () => Promise<void>;
  readonly hasTimelineChanges?: boolean;
  readonly isSavingTimeline?: boolean;
};

export function PlanRightPanel({
  startDate,
  endDate,
  tasks,
  phases = [],
  calendarIds = [],
  milestones = [],
  references = [],
  onMilestoneAdd,
  onMilestoneUpdate,
  onAddPhase,
  onEditPhase,
  onPhaseRangeChange,
  onAddCellComment,
  onAddCellFile,
  onAddCellLink,
  onToggleCellMilestone,
  onScrollToDateReady,
  onSaveTimeline,
  hasTimelineChanges = false,
  isSavingTimeline = false,
}: PlanRightPanelProps) {
  // Removed debug log to prevent potential re-render issues
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <GanttChart
        startDate={startDate}
        endDate={endDate}
        tasks={tasks as PlanTask[]}
        phases={phases}
        calendarIds={calendarIds}
        milestones={milestones}
        onMilestoneAdd={onMilestoneAdd}
        onMilestoneUpdate={onMilestoneUpdate}
        hideMainCalendar
        onAddPhase={onAddPhase}
        onEditPhase={onEditPhase}
        onPhaseRangeChange={onPhaseRangeChange}
        references={references}
        milestoneReferences={(references || []).filter(
          (ref) => ref.type === "milestone" && ref.date
        )}
        onAddCellComment={onAddCellComment}
        onAddCellFile={onAddCellFile}
        onAddCellLink={onAddCellLink}
        onToggleCellMilestone={onToggleCellMilestone}
        onScrollToDateReady={onScrollToDateReady}
        onSaveTimeline={onSaveTimeline}
        hasTimelineChanges={hasTimelineChanges}
        isSavingTimeline={isSavingTimeline}
      />
    </Box>
  );
}

export default PlanRightPanel;
