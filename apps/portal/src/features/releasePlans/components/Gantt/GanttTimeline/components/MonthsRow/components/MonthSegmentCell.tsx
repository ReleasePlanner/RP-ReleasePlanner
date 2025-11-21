import { TIMELINE_DIMENSIONS } from "../../../constants";
import type { MonthSegment } from "../types";
import type { MonthsRowStyles } from "../hooks/useMonthsRowStyles";
import type { TimelineColors } from "../../../constants";

export type MonthSegmentCellProps = {
  readonly segment: MonthSegment;
  readonly pxPerDay: number;
  readonly colors: TimelineColors;
  readonly styles: MonthsRowStyles;
};

export function MonthSegmentCell({
  segment,
  pxPerDay,
  colors,
  styles,
}: MonthSegmentCellProps) {
  return (
    <div
      key={segment.startIndex}
      className="absolute top-0 flex items-center justify-center border-r"
      style={{
        left: segment.startIndex * pxPerDay,
        width: segment.length * pxPerDay,
        height: TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT,
        color: colors.TEXT_PRIMARY,
        borderColor: colors.BORDER_LIGHT,
        fontSize: "0.8125rem",
        fontWeight: 700,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        backgroundColor: styles.backgroundColor,
      }}
    >
      {segment.label}
    </div>
  );
}

