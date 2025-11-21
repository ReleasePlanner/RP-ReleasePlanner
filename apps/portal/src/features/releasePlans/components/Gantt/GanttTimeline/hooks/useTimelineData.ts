import { useMemo } from "react";
import {
  buildDaysArray,
  buildMonthSegments,
  buildWeekSegments,
} from "../../../../lib/date";

export type TimelineData = {
  readonly days: Date[];
  readonly monthSegments: ReturnType<typeof buildMonthSegments>;
  readonly weekSegments: ReturnType<typeof buildWeekSegments>;
};

export function useTimelineData(
  start: Date,
  totalDays: number
): TimelineData {
  // Use start time (number) in deps so changes to the Date value are detected
  const startTime = start instanceof Date ? start.getTime() : 0;

  // Ensure we have safe numeric values to avoid NaN in styles when callers omit props
  const safeTotalDays =
    Number.isFinite(totalDays) && totalDays > 0 ? totalDays : 0;

  const days = useMemo(
    () => buildDaysArray(new Date(startTime), safeTotalDays),
    [startTime, safeTotalDays]
  );

  const monthSegments = useMemo(() => buildMonthSegments(days), [days]);
  const weekSegments = useMemo(() => buildWeekSegments(days), [days]);

  return {
    days,
    monthSegments,
    weekSegments,
  };
}

