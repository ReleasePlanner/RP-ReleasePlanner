import { TodayMarker } from "../index";
import { TIMELINE_DIMENSIONS } from "../constants";

export type TodayMarkerWrapperProps = {
  readonly todayIndex: number;
  readonly pxPerDay: number;
};

export function TodayMarkerWrapper({
  todayIndex,
  pxPerDay,
}: TodayMarkerWrapperProps) {
  return (
    <TodayMarker
      todayIndex={todayIndex}
      pxPerDay={pxPerDay}
      totalHeight={TIMELINE_DIMENSIONS.TOTAL_HEIGHT}
    />
  );
}

