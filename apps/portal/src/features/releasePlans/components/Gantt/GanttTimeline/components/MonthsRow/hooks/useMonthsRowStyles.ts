import { useMemo } from "react";
import { useTheme } from "@mui/material";

export type MonthsRowStyles = {
  readonly backgroundColor: string;
};

export function useMonthsRowStyles(
  colors: ReturnType<typeof import("../../constants").getTimelineColors>,
  theme: ReturnType<typeof useTheme>
): MonthsRowStyles {
  return useMemo(
    () => ({
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(0, 0, 0, 0.01)",
    }),
    [theme.palette.mode]
  );
}

