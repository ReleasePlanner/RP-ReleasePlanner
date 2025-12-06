import { memo } from "react";
import { useTheme } from "@mui/material/styles";
import { TodayMarker } from "../GanttChart.styles";
import GanttLane from "../../Gantt/GanttLane/GanttLane";
import { laneTop } from "../../Gantt/utils";
import { getTimelineColors } from "../../Gantt/GanttTimeline/constants";

export type GanttGridProps = {
  days: Date[];
  phases: { id: string }[];
  pxPerDay: number;
  trackHeight: number;
  todayIndex?: number;
};

/**
 * Renders the grid, lanes, and background elements
 * Follows SRP - only handles background visualization
 * ⚡ OPTIMIZATION: Memoized to prevent unnecessary re-renders
 */
export const GanttGrid = memo(
  function GanttGrid({
    days,
    phases,
    pxPerDay,
    trackHeight,
    todayIndex,
  }: GanttGridProps) {
    const theme = useTheme();
    const colors = getTimelineColors(theme);
    
    return (
      <div
        className="relative"
        style={{
          height: phases.length * (trackHeight + 8) + 8,
        }}
      >
        {/* Weekend shading across tracks */}
        {days.map((d, i) => {
          const dow = d.getDay();
          return dow === 0 || dow === 6 ? (
            <div
              key={`wk-${i}`}
              className="absolute top-0 pointer-events-none z-0"
              style={{
                left: i * pxPerDay,
                width: pxPerDay,
                height: "100%",
                backgroundColor: colors.WEEKEND_BG,
              }}
            />
          ) : null;
        })}

        {/* Phase lanes */}
        {phases.map((_, idx) => (
          <GanttLane
            key={`lane-${idx}`}
            top={laneTop(idx)}
            height={trackHeight}
            index={idx}
          />
        ))}

        {/* Grid lines */}
        {days.map((_, i) => (
          <div
            key={i}
            className="absolute top-0 border-r"
            style={{ 
              left: i * pxPerDay, 
              width: 0, 
              height: "100%",
              borderColor: colors.BORDER_LIGHT,
            }}
          />
        ))}

        {/* Today marker across tracks */}
        {typeof todayIndex === "number" && (
          <div
            className="absolute top-0 z-10"
            style={{
              left: todayIndex * pxPerDay,
              width: 0,
              height: "100%",
            }}
          >
            <TodayMarker className="h-full" />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // ⚡ OPTIMIZATION: Custom comparison to prevent unnecessary re-renders
    // Only re-render if relevant props change
    // IMPORTANT: Check if phase order changed - if order changed, we need to re-render
    const orderChanged = !prevProps.phases.every((p, i) => {
      const nextPhase = nextProps.phases[i];
      return nextPhase && p.id === nextPhase.id;
    });

    if (orderChanged) return false; // Order changed, need to re-render

    return (
      prevProps.phases.length === nextProps.phases.length &&
      prevProps.days.length === nextProps.days.length &&
      prevProps.pxPerDay === nextProps.pxPerDay &&
      prevProps.trackHeight === nextProps.trackHeight &&
      prevProps.todayIndex === nextProps.todayIndex &&
      // Check if phase IDs match at each index (order preserved)
      prevProps.phases.every((p, i) => p.id === nextProps.phases[i]?.id)
    );
  }
);
