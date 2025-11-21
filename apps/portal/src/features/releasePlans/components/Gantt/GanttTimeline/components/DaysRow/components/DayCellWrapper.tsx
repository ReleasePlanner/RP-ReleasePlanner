import type { PlanMilestone, PlanReference } from "../../../../../../types";
import { useDayReferences } from "../hooks/useDayReferences";
import { useDayDataItems } from "../hooks/useDayDataItems";
import { DayCell } from "./DayCell";

export type DayCellWrapperProps = {
  readonly date: Date;
  readonly index: number;
  readonly pxPerDay: number;
  readonly dateKey: string;
  readonly references: PlanReference[];
  readonly milestone?: PlanMilestone;
  readonly onContextMenu: (event: React.MouseEvent, date: string) => void;
  readonly onDayClick?: (date: string) => void;
};

export function DayCellWrapper({
  date,
  index,
  pxPerDay,
  dateKey,
  references,
  milestone,
  onContextMenu,
  onDayClick,
}: DayCellWrapperProps) {
  const referenceData = useDayReferences(references, dateKey);
  const dataItems = useDayDataItems(
    referenceData.commentsCount,
    referenceData.filesCount,
    referenceData.linksCount
  );

  return (
    <DayCell
      date={date}
      index={index}
      pxPerDay={pxPerDay}
      dateKey={dateKey}
      referenceData={referenceData}
      dataItems={dataItems}
      milestone={milestone}
      onContextMenu={onContextMenu}
      onDayClick={onDayClick}
    />
  );
}

