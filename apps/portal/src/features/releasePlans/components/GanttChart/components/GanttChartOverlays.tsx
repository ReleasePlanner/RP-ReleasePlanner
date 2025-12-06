import { memo, useCallback } from "react";
import { laneTop } from "../../Gantt/utils";
import { TRACK_HEIGHT } from "../../Gantt/constants";
import type { PlanPhase } from "../../../types";

export type GanttChartOverlaysProps = {
  phases: PlanPhase[];
  width: number;
  days: Date[];
  clientXToDayIndex: (clientX: number) => number;
  setDrag: (drag: {
    phaseId: string;
    phaseIdx: number;
    startIdx: number;
    currentIdx: number;
  }) => void;
  onEditPhase?: (id: string) => void;
  showSelectedDayAlert: (isoDate: string) => void;
};

/**
 * Renders interactive overlays for phases (span entire lane) - for drag selection
 * Follows SRP - only handles overlay interactions
 * ⚡ OPTIMIZATION: Memoized to prevent unnecessary re-renders
 */
export const GanttChartOverlays = memo(
  function GanttChartOverlays({
    phases,
    width,
    days,
    clientXToDayIndex,
    setDrag,
    onEditPhase,
    showSelectedDayAlert,
  }: GanttChartOverlaysProps) {
    const handleKeyDown = useCallback(
      (phaseId: string) => (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (onEditPhase) onEditPhase(phaseId);
        }
      },
      [onEditPhase]
    );

    return (
      <>
        {phases.map((ph, idx) => {
          const top = laneTop(idx);
          return (
            <div
              key={`ol-${ph.id ?? idx}`}
              className="absolute z-10"
              role="button"
              tabIndex={0}
              aria-label={`Drag to set ${ph.name} period`}
              style={{
                left: 0,
                top,
                width: width,
                height: TRACK_HEIGHT,
                cursor: "crosshair",
                pointerEvents: "auto",
              }}
              onMouseDown={(e) => {
                // Only handle if not right-clicking (context menu)
                if (e.button === 0) {
                  e.preventDefault();
                  e.stopPropagation();
                  const dayIdx = clientXToDayIndex(e.clientX);
                  setDrag({
                    phaseId: ph.id,
                    phaseIdx: idx,
                    startIdx: dayIdx,
                    currentIdx: dayIdx,
                  });
                }
              }}
              onClick={(e) => {
                // Only handle left click
                if (e.button === 0) {
                  const dayIdx = clientXToDayIndex(e.clientX);
                  const s = days[dayIdx]?.toISOString().slice(0, 10);
                  if (s) {
                    showSelectedDayAlert(s);
                  }
                }
              }}
              onDoubleClick={() => {
                if (onEditPhase) onEditPhase(ph.id);
              }}
              onKeyDown={handleKeyDown(ph.id)}
              title={`Drag to set ${ph.name} period`}
            />
          );
        })}
      </>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.phases.length !== nextProps.phases.length) return false;
    if (prevProps.width !== nextProps.width) return false;
    if (prevProps.days.length !== nextProps.days.length) return false;
    return true;
  }
);

