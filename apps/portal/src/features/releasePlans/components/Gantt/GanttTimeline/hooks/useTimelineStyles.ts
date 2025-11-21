import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { getTimelineColors } from "../constants";

export type TimelineStyles = {
  readonly width: number;
  readonly minWidth: number;
  readonly backgroundColor: string;
  readonly borderBottom: string;
  readonly boxShadow: string;
};

export function useTimelineStyles(
  totalDays: number,
  pxPerDay: number
): TimelineStyles {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return useMemo(() => {
    // Ensure we have safe numeric values
    const safeTotalDays =
      Number.isFinite(totalDays) && totalDays > 0 ? totalDays : 0;
    const safePxPerDay = Number.isFinite(pxPerDay) && pxPerDay > 0 ? pxPerDay : 1;

    // Calculate total width needed for all days
    const totalWidth = safeTotalDays * safePxPerDay;

    const backgroundColor = colors.HEADER_BACKGROUND || colors.BACKGROUND;
    const borderBottom = `2px solid ${colors.BORDER}`;
    const boxShadow =
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)"
        : "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)";

    return {
      width: totalWidth,
      minWidth: totalWidth,
      backgroundColor,
      borderBottom,
      boxShadow,
    };
  }, [totalDays, pxPerDay, colors, theme.palette.mode]);
}

