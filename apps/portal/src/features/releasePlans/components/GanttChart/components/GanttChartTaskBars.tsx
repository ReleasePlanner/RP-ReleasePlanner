import { memo } from "react";
import { useTheme } from "@mui/material/styles";
import { daysBetween } from "../../../lib/date";
import { laneTop } from "../../Gantt/utils";
import { TRACK_HEIGHT } from "../../Gantt/constants";
import TaskBar from "../../Gantt/TaskBar/TaskBar";
import type { PlanTask } from "../../../types";

export type GanttChartTaskBarsProps = {
  tasks: PlanTask[];
  phasesCount: number;
  start: Date;
  pxPerDay: number;
};

/**
 * Renders all task bars in the Gantt chart
 * Follows SRP - only handles task visualization
 * ⚡ OPTIMIZATION: Memoized to prevent unnecessary re-renders
 */
export const GanttChartTaskBars = memo(
  function GanttChartTaskBars({
    tasks,
    phasesCount,
    start,
    pxPerDay,
  }: GanttChartTaskBarsProps) {
    const theme = useTheme();

    return (
      <>
        {tasks.map((t, idx) => {
          const ts = new Date(t.startDate);
          const te = new Date(t.endDate);
          const offset = Math.max(0, daysBetween(start, ts));
          const len = Math.max(1, daysBetween(ts, te));
          const left = offset * pxPerDay;
          const barWidth = len * pxPerDay;
          const top = laneTop(phasesCount + idx);
          const color = t.color ?? theme.palette.primary.main;
          return (
            <TaskBar
              key={t.id}
              left={left}
              top={top}
              width={barWidth}
              height={TRACK_HEIGHT}
              color={color}
              label={t.title}
              title={`${t.title} (${t.startDate} → ${t.endDate})`}
            />
          );
        })}
      </>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.tasks.length !== nextProps.tasks.length) return false;
    if (prevProps.phasesCount !== nextProps.phasesCount) return false;
    if (prevProps.pxPerDay !== nextProps.pxPerDay) return false;
    if (prevProps.start.getTime() !== nextProps.start.getTime()) return false;
    return true;
  }
);

