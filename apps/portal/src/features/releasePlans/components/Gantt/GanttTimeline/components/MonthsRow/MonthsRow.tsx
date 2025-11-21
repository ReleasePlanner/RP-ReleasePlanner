import { TIMELINE_DIMENSIONS, getTimelineColors } from "../../constants";
import { useTheme } from "@mui/material";
import { TimelineRow } from "../TimelineRow";
import { MonthSegment } from "./types";
import { useMonthsRowStyles } from "./hooks/useMonthsRowStyles";
import { MonthSegmentCell } from "./components/MonthSegmentCell";

export type MonthsRowProps = {
  readonly monthSegments: MonthSegment[];
  readonly pxPerDay: number;
};

export function MonthsRow({ monthSegments, pxPerDay }: MonthsRowProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  const styles = useMonthsRowStyles(colors, theme);

  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT}>
      {monthSegments.map((m) => (
        <MonthSegmentCell
          key={m.startIndex}
          segment={m}
          pxPerDay={pxPerDay}
          colors={colors}
          styles={styles}
        />
      ))}
    </TimelineRow>
  );
}

