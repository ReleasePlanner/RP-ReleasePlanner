import { memo } from "react";
import { GanttCell } from "../../Gantt/GanttCell";
import { laneTop } from "../../Gantt/utils";
import type { PlanPhase, PlanReference } from "../../../types";

export type GanttChartCellsProps = {
  phases: PlanPhase[];
  references: PlanReference[];
  milestoneReferencesMap: Map<string, PlanReference>;
  days: Date[];
  getDayIndex: (date: Date) => number;
  totalDays: number;
  pxPerDay: number;
  trackHeight: number;
  onAddCellComment?: (phaseId: string, date: string) => void;
  onAddCellFile?: (phaseId: string, date: string) => void;
  onAddCellLink?: (phaseId: string, date: string) => void;
  onToggleCellMilestone?: (phaseId: string, date: string) => void;
};

/**
 * Renders Gantt cells for days that have references
 * ⚡ OPTIMIZATION: Only renders cells when there are references
 * This prevents rendering thousands of empty cells (phases × days)
 */
export const GanttChartCells = memo(
  function GanttChartCells({
    phases,
    references,
    milestoneReferencesMap,
    days,
    getDayIndex,
    totalDays,
    pxPerDay,
    trackHeight,
    onAddCellComment,
    onAddCellFile,
    onAddCellLink,
    onToggleCellMilestone,
  }: GanttChartCellsProps) {
    if (references.length === 0) return null;

    return (
      <>
        {phases.map((ph, phaseIdx) => {
          // Pre-filter references for this phase to avoid filtering in inner loop
          const phaseRefs = references.filter(
            (ref) => ref.phaseId === ph.id && ref.type !== "milestone"
          );

          if (phaseRefs.length === 0) return null;

          // Only render cells for days that have references
          const cellsWithRefs = phaseRefs
            .map((ref) => {
              if (!ref.date && !ref.calendarDayId) return null;
              const dateKey = ref.date || "";
              const dayDate = new Date(dateKey);
              const dayIdx = getDayIndex(dayDate);
              if (dayIdx < 0 || dayIdx >= totalDays) return null;

              const cellRefs = phaseRefs.filter(
                (r) => r.date === dateKey || r.calendarDayId
              );
              const milestoneKey = `${ph.id}-${dateKey}`;
              const milestoneRef = milestoneReferencesMap.get(milestoneKey);
              const top = laneTop(phaseIdx);
              const left = dayIdx * pxPerDay;

              return (
                <GanttCell
                  key={`cell-${ph.id ?? phaseIdx}-${dateKey}`}
                  phaseId={ph.id}
                  date={dateKey}
                  left={left}
                  top={top}
                  width={pxPerDay}
                  height={trackHeight}
                  cellReferences={cellRefs}
                  milestoneReference={milestoneRef}
                  onAddComment={onAddCellComment}
                  onAddFile={onAddCellFile}
                  onAddLink={onAddCellLink}
                  onToggleMilestone={onToggleCellMilestone}
                />
              );
            })
            .filter(Boolean);

          return cellsWithRefs;
        })}
      </>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.references.length !== nextProps.references.length) return false;
    if (prevProps.phases.length !== nextProps.phases.length) return false;
    if (prevProps.pxPerDay !== nextProps.pxPerDay) return false;
    if (prevProps.trackHeight !== nextProps.trackHeight) return false;
    if (prevProps.milestoneReferencesMap !== nextProps.milestoneReferencesMap)
      return false;
    return true;
  }
);

