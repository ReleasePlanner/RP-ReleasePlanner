import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import type { PlanReference } from "../../../../../../types";

export type DayMilestoneIndicatorProps = {
  readonly dayRefs: PlanReference[];
  readonly theme: ReturnType<typeof useTheme>;
};

export function DayMilestoneIndicator({
  dayRefs,
  theme,
}: DayMilestoneIndicatorProps) {
  const milestoneRef = dayRefs.find((r) => r.type === "milestone");
  const milestoneColor =
    milestoneRef?.milestoneColor ?? theme.palette.warning.main;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderLeft: "4px solid transparent",
        borderRight: "4px solid transparent",
        borderTop: `4px solid ${milestoneColor}`,
        zIndex: 3,
        pointerEvents: "none",
      }}
    />
  );
}

