import { MonthsRow, WeeksRow, DaysRow } from "./index";
import type { PlanMilestone, PlanReference } from "../../../types";
import {
  useTimelineData,
  useMilestonesMap,
  useTimelineStyles,
  useSafeTimelineValues,
} from "./hooks";
import { TimelineContainer, TodayMarkerWrapper } from "./components";

export type GanttTimelineProps = {
  readonly start: Date;
  readonly totalDays: number;
  readonly pxPerDay: number;
  readonly todayIndex?: number;
  readonly milestones?: PlanMilestone[];
  readonly onDayClick?: (date: string) => void;
  // References props (replaces cellData)
  readonly references?: PlanReference[]; // All references for the plan
  readonly onAddCellComment?: (date: string) => void;
  readonly onAddCellFile?: (date: string) => void;
  readonly onAddCellLink?: (date: string) => void;
  readonly onToggleCellMilestone?: (date: string) => void;
};

export default function GanttTimeline({
  start,
  totalDays,
  pxPerDay,
  todayIndex,
  milestones = [],
  onDayClick,
  references = [],
  onAddCellComment,
  onAddCellFile,
  onAddCellLink,
  onToggleCellMilestone,
}: GanttTimelineProps) {
  const safeValues = useSafeTimelineValues(totalDays, pxPerDay);
  const timelineData = useTimelineData(start, safeValues.totalDays);
  const milestonesMap = useMilestonesMap(milestones);
  const styles = useTimelineStyles(safeValues.totalDays, safeValues.pxPerDay);

  const shouldShowTodayMarker =
    typeof todayIndex === "number" &&
    todayIndex >= 0 &&
    todayIndex < safeValues.totalDays;

  return (
    <TimelineContainer styles={styles}>
      {shouldShowTodayMarker && (
        <TodayMarkerWrapper
          todayIndex={todayIndex}
          pxPerDay={safeValues.pxPerDay}
        />
      )}

      {/* Timeline rows */}
      <MonthsRow
        monthSegments={timelineData.monthSegments}
        pxPerDay={safeValues.pxPerDay}
      />
      <WeeksRow
        weekSegments={timelineData.weekSegments}
        pxPerDay={safeValues.pxPerDay}
      />
      <DaysRow
        days={timelineData.days}
        pxPerDay={safeValues.pxPerDay}
        milestones={milestonesMap}
        onDayClick={onDayClick}
        references={references}
        onAddCellComment={onAddCellComment}
        onAddCellFile={onAddCellFile}
        onAddCellLink={onAddCellLink}
        onToggleCellMilestone={onToggleCellMilestone}
      />
    </TimelineContainer>
  );
}
