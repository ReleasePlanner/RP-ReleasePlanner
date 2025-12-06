import { memo } from "react";
import GanttTimeline from "../../Gantt/GanttTimeline/GanttTimeline";
import PhasesList from "../../Plan/PhasesList/PhasesList";
import { GanttChartTracks } from "./GanttChartTracks";
import type {
  PlanTask,
  PlanPhase,
  PlanReference,
  PlanMilestone,
} from "../../../types";
import type { UseGanttChartLogicReturn } from "../hooks/useGanttChartLogic";

export type GanttChartNormalModeProps = {
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
  onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  onAddCellComment?: (phaseId: string, date: string) => void;
  onAddCellFile?: (phaseId: string, date: string) => void;
  onAddCellLink?: (phaseId: string, date: string) => void;
  onToggleCellMilestone?: (phaseId: string, date: string) => void;
  handleDayClick: (date: string) => void;
};

/**
 * Normal mode: show phases and tasks with interactive overlays
 * Follows SRP - only responsible for normal mode layout
 */
export const GanttChartNormalMode = memo(
  function GanttChartNormalMode({
    logic,
    phases,
    tasks,
    milestones,
    references,
    onAddPhase,
    onEditPhase,
    onAutoGenerate,
    onPhaseRangeChange,
    onAddCellComment,
    onAddCellFile,
    onAddCellLink,
    onToggleCellMilestone,
    handleDayClick,
  }: GanttChartNormalModeProps) {
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
      colors,
      phasesOrderKey,
    } = logic;

    return (
      <div
        className="border rounded-md"
        style={{
          borderColor: colors.BORDER,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: `${labelWidth}px 1fr`,
            height: "100%",
            minHeight: 0,
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Static phase list (left) */}
          <div
            className="border-r p-2"
            style={{
              backgroundColor: colors.BACKGROUND,
              borderColor: colors.BORDER,
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
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
              calendarStart={calendarStartStr}
              calendarEnd={calendarEndStr}
              onPhaseRangeChange={onPhaseRangeChange}
            />
          </div>
          {/* Scrollable calendar (right) */}
          <div
            ref={containerRef}
            className="overflow-auto"
            style={{
              backgroundColor: colors.TRACKS_BACKGROUND,
              overflowX: "auto",
              overflowY: "auto",
              height: "100%",
              minHeight: 0,
            }}
          >
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
              {/* Tracks */}
              <GanttChartTracks
                phases={phases}
                tasks={tasks}
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
                useSegments={false}
                showOverlays={true}
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
    if (prevProps.tasks.length !== nextProps.tasks.length) return false;
    if (prevProps.references.length !== nextProps.references.length) return false;
    return true;
  }
);

