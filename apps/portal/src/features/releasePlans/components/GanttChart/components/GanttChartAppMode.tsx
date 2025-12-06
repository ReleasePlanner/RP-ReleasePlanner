import { memo } from "react";
import GanttTimeline from "../../Gantt/GanttTimeline/GanttTimeline";
import PhasesList from "../../Plan/PhasesList/PhasesList";
import { TimelineToolbar } from "../../Gantt/GanttTimeline/TimelineToolbar";
import { GanttChartTracks } from "./GanttChartTracks";
import type {
  PlanTask,
  PlanPhase,
  PlanReference,
  PlanMilestone,
} from "../../../types";
import type { CalendarDay } from "../../../../../features/calendar/types";
import type { UseGanttChartLogicReturn } from "../hooks/useGanttChartLogic";

export type GanttChartAppModeProps = {
  // Logic hook return values
  logic: UseGanttChartLogicReturn;
  // Props
  phases: PlanPhase[];
  tasks: PlanTask[];
  milestones: PlanMilestone[];
  references: PlanReference[];
  onAddPhase?: () => void;
  onEditPhase?: (id: string) => void;
  onAutoGenerate?: () => void;
  onAddCellComment?: (phaseId: string, date: string) => void;
  onAddCellFile?: (phaseId: string, date: string) => void;
  onAddCellLink?: (phaseId: string, date: string) => void;
  onToggleCellMilestone?: (phaseId: string, date: string) => void;
  onSaveTimeline?: () => void;
  hasTimelineChanges?: boolean;
  isSavingTimeline?: boolean;
  handleDayClick: (date: string) => void;
};

/**
 * App mode: show a single header (months/weeks/days) and phase-only timeline on the right,
 * with a static phases list on the left
 * Follows SRP - only responsible for app mode layout
 */
export const GanttChartAppMode = memo(
  function GanttChartAppMode({
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
    onSaveTimeline,
    hasTimelineChanges = false,
    isSavingTimeline = false,
    handleDayClick,
  }: GanttChartAppModeProps) {
    const {
      containerRef,
      contentRef,
      labelWidth,
      width,
      start,
      totalDays,
      days,
      calendarStartStr,
      calendarEndStr,
      todayIndex,
      pxPerDay,
      trackHeight,
      weekendIndices,
      calendarDaysMap,
      milestoneReferencesMap,
      setDrag,
      setEditDrag,
      drag,
      editDrag,
      clientXToDayIndex,
      getDayIndex,
      showSelectedDayAlert,
      handleJumpToToday,
      colors,
      phasesOrderKey,
      TIMELINE_DIMENSIONS,
      TOOLBAR_HEIGHT,
    } = logic;

    return (
      <div
        className="border rounded-md"
        style={{
          borderColor: colors.BORDER,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${labelWidth}px 1fr`,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Static phase list (left) */}
          <div
            className="border-r p-2 pt-0"
            style={{
              backgroundColor: colors.BACKGROUND,
              borderColor: colors.BORDER,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <PhasesList
              phases={phases}
              onAdd={
                onAddPhase ||
                (() => {
                  // No-op handler
                })
              }
              onEdit={
                onEditPhase ||
                (() => {
                  // No-op handler
                })
              }
              onAutoGenerate={onAutoGenerate}
              headerOffsetTopPx={
                TIMELINE_DIMENSIONS.TOTAL_HEIGHT + 8 + TOOLBAR_HEIGHT
              }
              calendarStart={calendarStartStr}
              calendarEnd={calendarEndStr}
            />
          </div>
          {/* Scrollable phase-only timeline (right) */}
          <div
            ref={containerRef}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: colors.TRACKS_BACKGROUND,
              position: "relative",
            }}
          >
            {/* Elegant floating toolbar */}
            <TimelineToolbar
              onJumpToToday={handleJumpToToday}
              onSave={onSaveTimeline}
              hasChanges={hasTimelineChanges}
              isSaving={isSavingTimeline}
            />

            <div
              key={`timeline-content-${phasesOrderKey}`}
              ref={contentRef}
              className="min-w-full"
              style={{
                width: width,
                minWidth: width,
                backgroundColor: colors.TRACKS_BACKGROUND,
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <GanttTimeline
                start={start}
                totalDays={totalDays}
                pxPerDay={pxPerDay}
                todayIndex={todayIndex}
                milestones={milestones}
                onDayClick={handleDayClick}
                references={references}
                onAddCellComment={(date) => {
                  if (onAddCellComment) {
                    onAddCellComment("", date);
                  }
                }}
                onAddCellFile={(date) => {
                  if (onAddCellFile) {
                    onAddCellFile("", date);
                  }
                }}
                onAddCellLink={(date) => {
                  if (onAddCellLink) {
                    onAddCellLink("", date);
                  }
                }}
                onToggleCellMilestone={(date) => {
                  if (onToggleCellMilestone) {
                    onToggleCellMilestone("", date);
                  }
                }}
              />
              {/* Tracks: phases only */}
              <GanttChartTracks
                phases={phases}
                tasks={[]}
                references={references}
                milestoneReferencesMap={milestoneReferencesMap}
                days={days}
                calendarDaysMap={calendarDaysMap}
                weekendIndices={weekendIndices}
                start={start}
                totalDays={totalDays}
                pxPerDay={pxPerDay}
                trackHeight={trackHeight}
                todayIndex={todayIndex}
                width={width}
                colors={colors}
                getDayIndex={getDayIndex}
                clientXToDayIndex={clientXToDayIndex}
                setEditDrag={setEditDrag}
                setDrag={setDrag}
                drag={drag}
                editDrag={editDrag}
                onEditPhase={onEditPhase}
                onAddCellComment={onAddCellComment}
                onAddCellFile={onAddCellFile}
                onAddCellLink={onAddCellLink}
                onToggleCellMilestone={onToggleCellMilestone}
                showSelectedDayAlert={showSelectedDayAlert}
                useSegments={true}
                showOverlays={false}
              />
              {/* Empty space below tracks */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  backgroundColor: colors.TRACKS_BACKGROUND,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if critical props changed
    if (prevProps.phases.length !== nextProps.phases.length) return false;
    if (prevProps.references.length !== nextProps.references.length) return false;
    if (prevProps.hasTimelineChanges !== nextProps.hasTimelineChanges)
      return false;
    if (prevProps.isSavingTimeline !== nextProps.isSavingTimeline) return false;
    return true;
  }
);

