import { getTimelineColors, TIMELINE_POSITIONS } from "./constants";
import { useTheme } from "@mui/material/styles";

export type TodayMarkerProps = {
  todayIndex: number;
  pxPerDay: number;
  totalHeight: number;
};

export function TodayMarker({
  todayIndex,
  pxPerDay,
  totalHeight,
}: TodayMarkerProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  
  return (
    <div
      className="absolute top-0"
      style={{
        left: todayIndex * pxPerDay,
        width: 0,
        height: totalHeight,
        pointerEvents: "none",
      }}
    >
      <div
        className="h-full"
        style={{ borderLeft: `2px solid ${colors.TODAY_MARKER}` }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: TIMELINE_POSITIONS.TODAY_LABEL.top }}
      >
        <span
          aria-hidden="true"
          className="text-[10px] px-1 py-0.5 rounded border"
          style={{
            backgroundColor: colors.BUTTON_BG,
            borderColor: colors.BORDER,
            color: colors.BUTTON_TEXT,
          }}
        >
          Today
        </span>
      </div>
    </div>
  );
}

export type TodayButtonProps = {
  onJumpToToday: () => void;
};

export function TodayButton({ onJumpToToday }: TodayButtonProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  
  return (
    <div
      className="absolute"
      style={{
        top: TIMELINE_POSITIONS.TODAY_BUTTON.top,
        right: TIMELINE_POSITIONS.TODAY_BUTTON.right,
      }}
    >
      <button
        aria-label="Jump to today"
        className="text-xs px-2 py-1 rounded transition-colors"
        style={{
          backgroundColor: colors.BUTTON_BG,
          color: colors.BUTTON_TEXT,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.BUTTON_BG_HOVER;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.BUTTON_BG;
        }}
        onClick={onJumpToToday}
        type="button"
      >
        Today
      </button>
    </div>
  );
}

export function TimelineLegend() {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  
  return (
    <div
      className="absolute"
      style={{
        top: TIMELINE_POSITIONS.LEGEND.top,
        right: TIMELINE_POSITIONS.LEGEND.right,
      }}
    >
      <div 
        className="flex items-center gap-3 text-[10px] rounded border px-2 py-1"
        style={{
          backgroundColor: colors.BACKGROUND_OVERLAY,
          borderColor: colors.BORDER,
          color: colors.TEXT_SECONDARY,
        }}
      >
        <div className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm border"
            style={{
              backgroundColor: colors.WEEKEND_BG,
              borderColor: colors.WEEKEND_BORDER,
            }}
          />
          <span>Weekend</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="inline-block h-3"
            style={{
              width: 0,
              borderLeft: `2px dashed ${colors.TODAY_MARKER}`,
            }}
          />
          <span>Current day</span>
        </div>
      </div>
    </div>
  );
}
