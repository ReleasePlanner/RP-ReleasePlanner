import { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { daysBetween } from "../../../lib/date";
import { laneTop } from "../../Gantt/utils";
import PhaseBar from "../../Gantt/PhaseBar/PhaseBar";
import type { PlanPhase } from "../../../types";

export type GanttChartPhaseBarsProps = {
  phases: PlanPhase[];
  start: Date;
  days: Date[];
  pxPerDay: number;
  trackHeight: number;
  onEditPhase?: (id: string) => void;
  clientXToDayIndex: (clientX: number) => number;
  setEditDrag: (drag: {
    phaseId: string;
    phaseIdx: number;
    mode: "move" | "resize-left" | "resize-right";
    anchorIdx: number;
    currentIdx: number;
    originalStartIdx: number;
    originalLen: number;
  }) => void;
  useSegments?: boolean; // If true, splits phases into weekday-only segments
};

/**
 * Renders all phase bars in the Gantt chart
 * Follows SRP - only handles phase visualization and interactions
 * ⚡ OPTIMIZATION: Memoized to prevent unnecessary re-renders
 */
export const GanttChartPhaseBars = memo(
  function GanttChartPhaseBars({
    phases,
    start,
    days,
    pxPerDay,
    trackHeight,
    onEditPhase,
    clientXToDayIndex,
    setEditDrag,
    useSegments = false,
  }: GanttChartPhaseBarsProps) {
    const theme = useTheme();

    const phaseBars = useMemo(() => {
      return phases.map((ph, idx) => {
        if (!ph.startDate || !ph.endDate) return null;
        const ts = new Date(ph.startDate);
        const te = new Date(ph.endDate);
        const offset = Math.max(0, daysBetween(start, ts));
        const len = Math.max(1, daysBetween(ts, te));
        const top = laneTop(idx);
        const color = ph.color ?? theme.palette.secondary.main;

        // Calculate duration in weeks and days
        const weeks = Math.floor(len / 7);
        const remainingDays = len % 7;
        const durationText =
          weeks > 0
            ? `${weeks} week${weeks !== 1 ? "s" : ""}${
                remainingDays > 0
                  ? `, ${remainingDays} day${
                      remainingDays !== 1 ? "s" : ""
                    }`
                  : ""
              }`
            : `${len} day${len !== 1 ? "s" : ""}`;

        const tooltip = (
          <div
            style={{
              fontSize: "0.75rem",
              lineHeight: 1.6,
              maxWidth: 280,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                fontSize: "0.8125rem",
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
              }}
            >
              {ph.name}
            </div>
            <div style={{ marginBottom: "6px", opacity: 0.9 }}>
              <div style={{ 
                fontSize: "0.6875rem", 
                marginBottom: "2px",
                color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
              }}>
                <strong>Start:</strong>{" "}
                {ts.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div style={{ 
                fontSize: "0.6875rem",
                color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
              }}>
                <strong>End:</strong>{" "}
                {te.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <div
              style={{
                marginBottom: "6px",
                fontSize: "0.6875rem",
                opacity: 0.9,
                color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
              }}
            >
              <strong>Duration:</strong> {durationText} ({len} day
              {len !== 1 ? "s" : ""})
            </div>
            {ph.color && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.6875rem",
                  opacity: 0.9,
                  color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
                }}
              >
                <strong>Color:</strong>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 2,
                    backgroundColor: ph.color,
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)"
                    }`,
                  }}
                />
                <span>{ph.color}</span>
              </div>
            )}
          </div>
        );

        if (useSegments) {
          // Build weekday-only segments so weekends keep non-working color
          const segments: { startIdx: number; length: number }[] = [];
          let segStart: number | null = null;
          for (let di = 0; di < len; di++) {
            const dayIdx = offset + di;
            // Ensure dayIdx is within bounds
            if (dayIdx < 0 || dayIdx >= days.length) continue;
            const d = days[dayIdx];
            if (!d) continue;
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            if (isWeekend) {
              if (segStart !== null) {
                segments.push({
                  startIdx: segStart,
                  length: dayIdx - segStart,
                });
                segStart = null;
              }
            } else {
              if (segStart === null) segStart = dayIdx;
            }
          }
          if (segStart !== null) {
            segments.push({
              startIdx: segStart,
              length: offset + len - segStart,
            });
          }
          if (segments.length === 0) return null;

          return segments.map((seg, sIdx) => {
            const left = seg.startIdx * pxPerDay;
            const width = seg.length * pxPerDay;
            return (
              <PhaseBar
                key={`${ph.id ?? idx}-seg-${sIdx}`}
                left={left}
                top={top}
                width={width}
                height={trackHeight}
                color={color}
                label={sIdx === 0 ? ph.name : undefined}
                title={`${ph.name} (${ph.startDate} → ${ph.endDate})`}
                ariaLabel={`${ph.name} from ${ph.startDate} to ${ph.endDate}`}
                tooltipContent={tooltip}
                testIdSuffix={ph.id}
                onDoubleClick={() => {
                  if (onEditPhase) onEditPhase(ph.id);
                }}
                onStartMove={(e) => {
                  const anchorIdx = clientXToDayIndex(e.clientX);
                  setEditDrag({
                    phaseId: ph.id,
                    phaseIdx: idx,
                    mode: "move",
                    anchorIdx,
                    currentIdx: anchorIdx,
                    originalStartIdx: offset,
                    originalLen: len,
                  });
                }}
              />
            );
          });
        } else {
          // Simple single bar rendering
          const left = offset * pxPerDay;
          const barWidth = len * pxPerDay;
          return (
            <PhaseBar
              key={ph.id ?? idx}
              left={left}
              top={top}
              width={barWidth}
              height={trackHeight}
              color={color}
              label={ph.name}
              title={`${ph.name} (${ph.startDate} → ${ph.endDate})`}
              ariaLabel={`${ph.name} from ${ph.startDate} to ${ph.endDate}`}
              tooltipContent={tooltip}
              testIdSuffix={ph.id}
              onDoubleClick={() => {
                if (onEditPhase) onEditPhase(ph.id);
              }}
              onStartMove={(e) => {
                const anchorIdx = clientXToDayIndex(e.clientX);
                setEditDrag({
                  phaseId: ph.id,
                  phaseIdx: idx,
                  mode: "move",
                  anchorIdx,
                  currentIdx: anchorIdx,
                  originalStartIdx: offset,
                  originalLen: len,
                });
              }}
            />
          );
        }
      });
    }, [
      phases,
      start,
      days,
      pxPerDay,
      trackHeight,
      theme.palette.secondary.main,
      theme.palette.mode,
      onEditPhase,
      clientXToDayIndex,
      setEditDrag,
      useSegments,
    ]);

    return <>{phaseBars.flat()}</>;
  },
  (prevProps, nextProps) => {
    // Always re-render if array length changed
    if (prevProps.phases.length !== nextProps.phases.length) return false;
    if (prevProps.days.length !== nextProps.days.length) return false;
    if (prevProps.pxPerDay !== nextProps.pxPerDay) return false;
    if (prevProps.trackHeight !== nextProps.trackHeight) return false;
    if (prevProps.start.getTime() !== nextProps.start.getTime()) return false;
    if (prevProps.useSegments !== nextProps.useSegments) return false;

    // Check if phase order changed
    const orderMatches = prevProps.phases.every((p, i) => {
      const nextPhase = nextProps.phases[i];
      return nextPhase && p.id === nextPhase.id;
    });
    if (!orderMatches) return false;

    // ⚡ CRITICAL: Deep comparison of phases - must detect date changes
    // Return false (re-render) if ANY phase has different dates
    const phasesMatch = prevProps.phases.every((p, i) => {
      const nextPhase = nextProps.phases[i];
      if (!nextPhase || p.id !== nextPhase.id) return false;
      
      // Compare dates as strings - if they differ, we need to re-render
      if (p.startDate !== nextPhase.startDate || p.endDate !== nextPhase.endDate) {
        return false; // Dates changed, need to re-render
      }
      
      // Compare other properties
      return (
        p.color === nextPhase.color &&
        p.name === nextPhase.name
      );
    });
    
    // If phases don't match, re-render
    return phasesMatch;
  }
);

