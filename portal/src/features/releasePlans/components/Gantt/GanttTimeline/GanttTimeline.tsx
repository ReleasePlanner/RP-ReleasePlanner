import { useMemo } from "react";
import {
  buildDaysArray,
  buildMonthSegments,
  buildWeekSegments,
} from "../../../lib/date";

export type GanttTimelineProps = {
  start: Date;
  totalDays: number;
  pxPerDay: number;
  todayIndex?: number;
  onJumpToToday?: () => void;
};

export default function GanttTimeline({
  start,
  totalDays,
  pxPerDay,
  todayIndex,
  onJumpToToday,
}: GanttTimelineProps) {
  const monthsRow = 28;
  const weeksRow = 24;
  const daysRow = 24;

  // Use start time (number) in deps so changes to the Date value are detected
  const startTime = start instanceof Date ? start.getTime() : 0;

  // Ensure we have safe numeric values to avoid NaN in styles when callers omit props
  const safeTotalDays =
    Number.isFinite(totalDays) && totalDays > 0 ? totalDays : 0;
  const safePxPerDay = Number.isFinite(pxPerDay) && pxPerDay > 0 ? pxPerDay : 1;

  const days = useMemo(
    () => buildDaysArray(new Date(startTime), safeTotalDays),
    [startTime, safeTotalDays]
  );
  const monthSegments = useMemo(() => buildMonthSegments(days), [days]);
  const weekSegments = useMemo(() => buildWeekSegments(days), [days]);

  return (
    <div
      className="sticky top-0 z-10 bg-white border-b border-gray-200"
      style={{ height: monthsRow + weeksRow + daysRow }}
    >
      {/* Today marker */}
      {typeof todayIndex === "number" &&
        todayIndex >= 0 &&
        todayIndex < safeTotalDays && (
          <div
            className="absolute top-0"
            style={{
              left: todayIndex * safePxPerDay,
              width: 0,
              height: monthsRow + weeksRow + daysRow,
              pointerEvents: "none", // marker should not block pointer events below
            }}
          >
            <div
              className="h-full"
              style={{ borderLeft: "2px solid rgba(24,90,189,0.6)" }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: 0 }}
            >
              <span
                aria-hidden="true"
                className="text-[10px] px-1 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-700"
              >
                Today
              </span>
            </div>
          </div>
        )}
      {/* Jump to today button */}
      {onJumpToToday && (
        <div className="absolute top-1 right-2">
          <button
            aria-label="Jump to today"
            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
            onClick={onJumpToToday}
            type="button"
          >
            Today
          </button>
        </div>
      )}
      {/* Legend */}
      <div className="absolute right-2" style={{ top: 26 }}>
        <div className="flex items-center gap-3 text-[10px] text-gray-600 bg-white/80 rounded border border-gray-200 px-2 py-1">
          <div className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm border"
              style={{ backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" }}
            />
            <span>Weekend</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="inline-block h-3"
              style={{ width: 0, borderLeft: "2px dashed rgba(24,90,189,0.6)" }}
            />
            <span>Current day</span>
          </div>
        </div>
      </div>
      {/* Months */}
      <div className="relative" style={{ height: monthsRow }}>
        {monthSegments.map((m) => (
          <div
            key={m.startIndex}
            className="absolute top-0 text-[11px] text-gray-700 font-medium flex items-center justify-center border-r border-gray-200"
            style={{
              left: m.startIndex * safePxPerDay,
              width: m.length * safePxPerDay,
              height: monthsRow,
            }}
          >
            {m.label}
          </div>
        ))}
      </div>
      {/* Weeks */}
      <div className="relative" style={{ height: weeksRow }}>
        {weekSegments.map((w) => (
          <div
            key={w.startIndex}
            className="absolute top-0 text-[10px] text-gray-500 flex items-center justify-center border-r border-gray-100"
            style={{
              left: w.startIndex * safePxPerDay,
              width: w.length * safePxPerDay,
              height: weeksRow,
            }}
          >
            {w.label}
          </div>
        ))}
      </div>
      {/* Days */}
      <div className="relative" style={{ height: daysRow }}>
        {days.map((d, i) => (
          <div
            key={d.getTime()}
            className="absolute top-0 border-r border-gray-100 text-[10px] text-gray-400 flex items-center justify-center"
            style={{
              left: i * safePxPerDay,
              width: safePxPerDay,
              height: daysRow,
              backgroundColor:
                d.getDay() === 0 || d.getDay() === 6 ? "#f3f4f6" : undefined,
            }}
            title={d.toISOString().slice(0, 10)}
          >
            {d.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
