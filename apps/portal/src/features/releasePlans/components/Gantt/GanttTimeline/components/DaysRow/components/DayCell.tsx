import { useCallback } from "react";
import { TIMELINE_DIMENSIONS } from "../../../constants";
import { getTimelineColors } from "../../../constants";
import { useTheme } from "@mui/material";
import type { DayReferenceData } from "../hooks/useDayReferences";
import type { DayDataItem } from "../hooks/useDayDataItems";
import type { PlanMilestone } from "../../../../../../types";
import { DayNumber } from "./DayNumber";
import { DayMilestoneIndicator } from "./DayMilestoneIndicator";
import { DayDataIndicators } from "./DayDataIndicators";
import { PlanMilestoneMarker } from "./PlanMilestoneMarker";

export type DayCellProps = {
  readonly date: Date;
  readonly index: number;
  readonly pxPerDay: number;
  readonly dateKey: string;
  readonly referenceData: DayReferenceData;
  readonly dataItems: DayDataItem[];
  readonly milestone?: PlanMilestone;
  readonly onContextMenu: (event: React.MouseEvent, date: string) => void;
  readonly onDayClick?: (date: string) => void;
};

export function DayCell({
  date,
  index,
  pxPerDay,
  dateKey,
  referenceData,
  dataItems,
  milestone,
  onContextMenu,
  onDayClick,
}: DayCellProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const hasMultipleItems =
    referenceData.commentsCount +
      referenceData.filesCount +
      referenceData.linksCount >
    1;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor =
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)";
    },
    [theme.palette.mode]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const weekendBg = colors.WEEKEND_BG || undefined;
      e.currentTarget.style.backgroundColor = isWeekend ? weekendBg : undefined;
    },
    [isWeekend, colors.WEEKEND_BG]
  );

  const handleClick = useCallback(() => {
    if (onDayClick) {
      onDayClick(dateKey);
    }
  }, [onDayClick, dateKey]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      key={`day-${index}-${dateKey}`}
      className="absolute top-0 border-r flex items-center justify-center"
      role="button"
      tabIndex={0}
      style={{
        left: `${index * pxPerDay}px`,
        width: `${pxPerDay}px`,
        minWidth: `${pxPerDay}px`,
        height: TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT,
        backgroundColor: isWeekend ? colors.WEEKEND_BG : undefined,
        borderColor: colors.BORDER_LIGHT,
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxSizing: "border-box",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => onContextMenu(e, dateKey)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Day ${date.getDate()}`}
    >
      <DayNumber date={date} colors={colors} theme={theme} />
      {referenceData.isDayMilestone && (
        <DayMilestoneIndicator
          dayRefs={referenceData.dayRefs}
          theme={theme}
        />
      )}
      {referenceData.hasData && (
        <DayDataIndicators
          dataItems={dataItems}
          hasMultipleItems={hasMultipleItems}
        />
      )}
      {milestone && (
        <PlanMilestoneMarker milestone={milestone} dateKey={dateKey} />
      )}
    </div>
  );
}
