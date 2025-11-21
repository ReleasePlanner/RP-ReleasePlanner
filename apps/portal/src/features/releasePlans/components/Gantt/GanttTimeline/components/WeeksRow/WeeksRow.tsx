import { TIMELINE_DIMENSIONS, getTimelineColors } from "../../constants";
import { useTheme } from "@mui/material";
import { TimelineRow } from "../TimelineRow";
import { WeekSegment } from "./types";
import { WeekSegmentCell } from "./components/WeekSegmentCell";

export type WeeksRowProps = {
  readonly weekSegments: WeekSegment[];
  readonly pxPerDay: number;
};

export function WeeksRow({ weekSegments, pxPerDay }: WeeksRowProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT}>
      {weekSegments.map((w) => (
        <WeekSegmentCell
          key={w.startIndex}
          segment={w}
          pxPerDay={pxPerDay}
          colors={colors}
        />
      ))}
    </TimelineRow>
  );
}

