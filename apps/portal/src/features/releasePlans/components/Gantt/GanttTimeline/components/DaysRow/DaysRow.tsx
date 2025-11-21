import { TIMELINE_DIMENSIONS } from "../../constants";
import type { PlanMilestone, PlanReference } from "../../../../../types";
import { TimelineRow } from "../TimelineRow";
import {
  useDaysRowContextMenu,
  useDaysRowHandlers,
} from "./hooks";
import {
  DayCellWrapper,
  DaysRowContextMenu,
} from "./components";

export type DaysRowProps = {
  readonly days: Date[];
  readonly pxPerDay: number;
  readonly milestones?: Map<string, PlanMilestone>;
  readonly onDayClick?: (date: string) => void;
  // References props (replaces cellData)
  readonly references?: PlanReference[]; // All references for the plan
  readonly onAddCellComment?: (date: string) => void;
  readonly onAddCellFile?: (date: string) => void;
  readonly onAddCellLink?: (date: string) => void;
  readonly onToggleCellMilestone?: (date: string) => void;
};

/* @refresh reset */
export function DaysRow({
  days,
  pxPerDay,
  milestones = new Map(),
  onDayClick,
  references = [],
  onAddCellComment,
  onAddCellFile,
  onAddCellLink,
  onToggleCellMilestone,
}: DaysRowProps) {
  const { contextMenu, handleContextMenu, handleClose } =
    useDaysRowContextMenu();
  const handlers = useDaysRowHandlers(
    contextMenu,
    handleClose,
    onAddCellComment,
    onAddCellFile,
    onAddCellLink,
    onToggleCellMilestone
  );

  // Calculate total width needed for all days
  const totalWidth = days.length * pxPerDay;

  return (
    <>
      <TimelineRow height={TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT}>
        <div
          style={{
            position: "relative",
            width: `${totalWidth}px`,
            minWidth: `${totalWidth}px`,
            height: TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT,
          }}
        >
          {days.map((d, i) => {
            const dateKey = d.toISOString().slice(0, 10);
            const milestone = milestones.get(dateKey);

            return (
              <DayCellWrapper
                key={`day-${i}-${dateKey}`}
                date={d}
                index={i}
                pxPerDay={pxPerDay}
                dateKey={dateKey}
                references={references}
                milestone={milestone}
                onContextMenu={handleContextMenu}
                onDayClick={onDayClick}
              />
            );
          })}
        </div>
      </TimelineRow>

      <DaysRowContextMenu
        contextMenu={contextMenu}
        onClose={handleClose}
        handlers={handlers}
        references={references}
      />
    </>
  );
}
