import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";

export type LaneStyles = {
  readonly background: string;
  readonly borderColor: string;
};

export function useLaneStyles(index: number): LaneStyles {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return useMemo(() => {
    const isEven = index % 2 === 0;

    // Use white overlay for dark mode, black overlay for light mode
    // Increased opacity for better visibility in dark mode
    let background: string;
    if (isEven) {
      background = isDark
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.015)";
    } else {
      background = isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.03)";
    }

    // Increased opacity for better visibility
    const borderColor = isDark
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.06)";

    return {
      background,
      borderColor,
    };
  }, [index, isDark]);
}

