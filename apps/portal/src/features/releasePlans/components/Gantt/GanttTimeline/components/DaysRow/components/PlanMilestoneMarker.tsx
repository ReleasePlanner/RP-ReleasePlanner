import { Tooltip } from "@mui/material";
import { Flag as FlagIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import type { PlanMilestone } from "../../../../../../types";

export type PlanMilestoneMarkerProps = {
  readonly milestone: PlanMilestone;
  readonly dateKey: string;
};

export function PlanMilestoneMarker({
  milestone,
  dateKey,
}: PlanMilestoneMarkerProps) {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        <div style={{ fontSize: "0.75rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "4px" }}>
            {milestone.name}
          </div>
          {milestone.description && (
            <div style={{ fontSize: "0.7rem", opacity: 0.9 }}>
              {milestone.description}
            </div>
          )}
          <div
            style={{
              fontSize: "0.7rem",
              opacity: 0.8,
              marginTop: "4px",
            }}
          >
            {dateKey}
          </div>
        </div>
      }
      arrow
      placement="top"
    >
      <FlagIcon
        sx={{
          position: "absolute",
          top: -2,
          right: 2,
          fontSize: "12px",
          color: theme.palette.mode === "dark" ? "#fbbf24" : "#f59e0b",
          filter:
            theme.palette.mode === "dark"
              ? "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
              : "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
          zIndex: 2,
          pointerEvents: "auto",
        }}
      />
    </Tooltip>
  );
}

