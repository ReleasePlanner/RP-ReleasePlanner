import { memo } from "react";
import GanttLane from "../../Gantt/GanttLane/GanttLane";
import { laneTop } from "../../Gantt/utils";
import { TRACK_HEIGHT, LANE_GAP } from "../../Gantt/constants";
import { OptimizedWeekendGrid } from "./OptimizedWeekendGrid";
import { OptimizedGridLines } from "./OptimizedGridLines";
import { TodayMarker } from "../GanttChart.styles";
import { GanttChartCalendarMarkers } from "./GanttChartCalendarMarkers";
import { GanttChartPhaseBars } from "./GanttChartPhaseBars";
import { GanttChartCells } from "./GanttChartCells";
import { GanttChartTaskBars } from "./GanttChartTaskBars";
import { GanttChartOverlays } from "./GanttChartOverlays";
import type { PlanPhase, PlanTask, PlanReference } from "../../../types";
import type { CalendarDay } from "../../../../../features/calendar/types";

export type GanttChartTracksProps = {
  phases: PlanPhase[];
  tasks: PlanTask[];
  references: PlanReference[];
  milestoneReferencesMap: Map<string, PlanReference>;
  days: Date[];
  calendarDaysMap: Map<
    string,
    Array<{ day: CalendarDay; calendarName: string }>
  >;
  weekendIndices: Set<number>;
  start: Date;
  totalDays: number;
  pxPerDay: number;
  trackHeight: number;
  todayIndex?: number;
  width: number;
  colors: {
    TRACKS_BACKGROUND: string;
    WEEKEND_BG: string;
    BORDER_LIGHT: string;
  };
  getDayIndex: (date: Date) => number;
  clientXToDayIndex: (clientX: number) => number;
  setEditDrag: (drag: {
    phaseId: string;
    phaseIdx: number;
    mode: "move" | "resize-left" | "resize-right";
    anchorIdx: number;
    currentIdx: number;
    originalStartIdx: number;
    originalLen: number;
  }) => void;
  setDrag: (drag: {
    phaseId: string;
    phaseIdx: number;
    startIdx: number;
    currentIdx: number;
  }) => void;
  drag?: {
    phaseId: string;
    phaseIdx: number;
    startIdx: number;
    currentIdx: number;
  } | null;
  editDrag?: {
    phaseId: string;
    phaseIdx: number;
    mode: "move" | "resize-left" | "resize-right";
    anchorIdx: number;
    currentIdx: number;
    originalStartIdx: number;
    originalLen: number;
  } | null;
  onEditPhase?: (id: string) => void;
  onAddCellComment?: (phaseId: string, date: string) => void;
  onAddCellFile?: (phaseId: string, date: string) => void;
  onAddCellLink?: (phaseId: string, date: string) => void;
  onToggleCellMilestone?: (phaseId: string, date: string) => void;
  showSelectedDayAlert: (isoDate: string) => void;
  useSegments?: boolean; // If true, splits phases into weekday-only segments
  showOverlays?: boolean; // If true, shows interactive overlays (only in normal mode)
};

/**
 * Container component for all Gantt chart tracks
 * Includes lanes, grid lines, markers, phase bars, task bars, cells, and overlays
 * Follows SRP - only responsible for track container and composition
 */
export const GanttChartTracks = memo(
  function GanttChartTracks({
    phases,
    tasks,
    references,
    milestoneReferencesMap,
    days,
    calendarDaysMap,
    weekendIndices,
    start,
    totalDays,
    pxPerDay,
    trackHeight,
    todayIndex,
    width,
    colors,
    getDayIndex,
    clientXToDayIndex,
    setEditDrag,
    setDrag,
    drag,
    editDrag,
    onEditPhase,
    onAddCellComment,
    onAddCellFile,
    onAddCellLink,
    onToggleCellMilestone,
    showSelectedDayAlert,
    useSegments = false,
    showOverlays = false,
  }: GanttChartTracksProps) {
    const tracksHeight =
      (phases.length + tasks.length) * (trackHeight + LANE_GAP) + LANE_GAP;

    return (
      <div
        className="relative"
        style={{
          height: tracksHeight,
          backgroundColor: colors.TRACKS_BACKGROUND,
        }}
      >
        {/* Weekend grid background */}
        <OptimizedWeekendGrid
          start={start}
          totalDays={totalDays}
          pxPerDay={pxPerDay}
          weekendIndices={weekendIndices}
          backgroundColor={colors.WEEKEND_BG}
        />

        {/* Calendar day markers */}
        <GanttChartCalendarMarkers
          days={days}
          calendarDaysMap={calendarDaysMap}
          pxPerDay={pxPerDay}
        />

        {/* Phase lanes */}
        {phases.map((ph, idx) => (
          <GanttLane
            key={`lane-${ph.id ?? idx}`}
            top={laneTop(idx)}
            height={trackHeight}
            index={idx}
          />
        ))}

        {/* Task lanes */}
        {tasks.map((_, tIdx) => (
          <GanttLane
            key={`lane-task-${tIdx}`}
            top={laneTop(phases.length + tIdx)}
            height={trackHeight}
            index={phases.length + tIdx}
          />
        ))}

        {/* Grid lines */}
        <OptimizedGridLines
          totalDays={totalDays}
          pxPerDay={pxPerDay}
          borderColor={colors.BORDER_LIGHT}
          interval={1}
        />

        {/* Today marker */}
        {typeof todayIndex === "number" && (
          <div
            className="absolute top-0"
            style={{
              left: todayIndex * pxPerDay,
              width: 0,
              height: "100%",
              zIndex: 4,
            }}
          >
            <TodayMarker className="h-full" />
          </div>
        )}

        {/* Phase bars */}
        <GanttChartPhaseBars
          phases={phases}
          start={start}
          days={days}
          pxPerDay={pxPerDay}
          trackHeight={trackHeight}
          onEditPhase={onEditPhase}
          clientXToDayIndex={clientXToDayIndex}
          setEditDrag={setEditDrag}
          useSegments={useSegments}
        />

        {/* Cells (only render when not dragging and when there are references) */}
        {!(drag || editDrag) && (
          <GanttChartCells
            phases={phases}
            references={references}
            milestoneReferencesMap={milestoneReferencesMap}
            days={days}
            getDayIndex={getDayIndex}
            totalDays={totalDays}
            pxPerDay={pxPerDay}
            trackHeight={trackHeight}
            onAddCellComment={onAddCellComment}
            onAddCellFile={onAddCellFile}
            onAddCellLink={onAddCellLink}
            onToggleCellMilestone={onToggleCellMilestone}
          />
        )}

        {/* Task bars */}
        <GanttChartTaskBars
          tasks={tasks}
          phasesCount={phases.length}
          start={start}
          pxPerDay={pxPerDay}
        />

        {/* Interactive overlays (only in normal mode) */}
        {showOverlays && (
          <GanttChartOverlays
            phases={phases}
            width={width}
            days={days}
            clientXToDayIndex={clientXToDayIndex}
            setDrag={setDrag}
            onEditPhase={onEditPhase}
            showSelectedDayAlert={showSelectedDayAlert}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if critical props changed
    if (prevProps.phases.length !== nextProps.phases.length) return false;
    if (prevProps.tasks.length !== nextProps.tasks.length) return false;
    if (prevProps.references.length !== nextProps.references.length)
      return false;
    if (prevProps.days.length !== nextProps.days.length) return false;
    if (prevProps.pxPerDay !== nextProps.pxPerDay) return false;
    if (prevProps.trackHeight !== nextProps.trackHeight) return false;
    if (prevProps.todayIndex !== nextProps.todayIndex) return false;
    if (prevProps.width !== nextProps.width) return false;
    if (prevProps.drag !== nextProps.drag) return false;
    if (prevProps.editDrag !== nextProps.editDrag) return false;
    if (prevProps.useSegments !== nextProps.useSegments) return false;
    if (prevProps.showOverlays !== nextProps.showOverlays) return false;
    return true;
  }
);
