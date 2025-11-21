import { TIMELINE_DIMENSIONS } from "../../../constants";
import type { WeekSegment } from "../types";
import type { TimelineColors } from "../../../constants";

export type WeekSegmentCellProps = {
  readonly segment: WeekSegment;
  readonly pxPerDay: number;
  readonly colors: TimelineColors;
};

export function WeekSegmentCell({
  segment,
  pxPerDay,
  colors,
}: WeekSegmentCellProps) {
  return (
    <div
      key={segment.startIndex}
      className="absolute top-0 flex items-center justify-center border-r border-b"
      style={{
        left: segment.startIndex * pxPerDay,
        width: segment.length * pxPerDay,
        height: TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT,
        color: colors.TEXT_SECONDARY,
        borderColor: colors.BORDER_LIGHT,
        borderBottomWidth: "1px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}
    >
      {segment.label}
    </div>
  );
}

