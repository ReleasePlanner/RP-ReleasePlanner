import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import type { TimelineColors } from "../../../constants";

export type DayNumberProps = {
  readonly date: Date;
  readonly colors: TimelineColors;
  readonly theme: ReturnType<typeof useTheme>;
};

export function DayNumber({ date, colors, theme }: DayNumberProps) {
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        color:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.85)"
            : colors.TEXT_MUTED,
        fontSize: "0.75rem",
        fontWeight: 600,
        userSelect: "none",
        pointerEvents: "none",
        textShadow:
          theme.palette.mode === "dark"
            ? "0 1px 2px rgba(0, 0, 0, 0.5)"
            : "none",
      }}
    >
      {date.getDate()}
    </Box>
  );
}

