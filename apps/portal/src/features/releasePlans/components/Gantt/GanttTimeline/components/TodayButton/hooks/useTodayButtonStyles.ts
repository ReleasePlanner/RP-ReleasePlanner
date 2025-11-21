import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";
import { getTimelineColors } from "../../../constants";

export function useTodayButtonStyles() {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  const button = useMemo(
    () => ({
      backgroundColor: colors.BUTTON_BG,
      color: colors.BUTTON_TEXT,
      border: `1px solid ${colors.BORDER}`,
      width: 32,
      height: 28,
      "&:hover": {
        backgroundColor: colors.BUTTON_BG_HOVER,
        transform: "scale(1.05)",
      },
      transition: "all 0.2s ease",
      boxShadow:
        theme.palette.mode === "dark"
          ? `0 2px 4px ${alpha(theme.palette.common.black, 0.3)}`
          : `0 1px 3px ${alpha(theme.palette.common.black, 0.15)}`,
    }),
    [colors, theme.palette.mode]
  );

  return { button };
}

