import { Box, Tooltip, useTheme, alpha } from "@mui/material";
import type { PlanReference } from "../../../../types";

export type MilestoneIndicatorProps = {
  readonly milestoneReference: PlanReference;
  readonly date: string;
};

export function MilestoneIndicator({
  milestoneReference,
  date,
}: MilestoneIndicatorProps) {
  const theme = useTheme();
  const milestoneColor = milestoneReference.milestoneColor ?? theme.palette.warning.main;

  return (
    <Tooltip
      title={
        <div style={{ fontSize: "0.8125rem", maxWidth: 300 }}>
          <div
            style={{
              fontWeight: 600,
              marginBottom: "6px",
              fontSize: "0.875rem",
            }}
          >
            {milestoneReference.title || "Milestone"}
          </div>
          {milestoneReference.description && (
            <div
              style={{
                fontSize: "0.75rem",
                opacity: 0.9,
                marginBottom: "4px",
                lineHeight: 1.5,
              }}
            >
              {milestoneReference.description}
            </div>
          )}
          <div style={{ fontSize: "0.6875rem", opacity: 0.8, marginTop: "4px" }}>
            <span role="img" aria-label="Calendar">📅</span> {date}
          </div>
          {milestoneReference.milestoneColor && (
            <div
              style={{
                fontSize: "0.6875rem",
                opacity: 0.8,
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: milestoneReference.milestoneColor,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              />
              Color: {milestoneReference.milestoneColor}
            </div>
          )}
        </div>
      }
      arrow
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.9)",
            "& .MuiTooltip-arrow": {
              color: "rgba(0, 0, 0, 0.9)",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -2,
          right: -2,
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `12px solid ${milestoneColor}`,
          zIndex: 3,
          filter: `drop-shadow(0 2px 4px ${alpha(milestoneColor, 0.4)})`,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.15)",
            filter: `drop-shadow(0 3px 6px ${alpha(milestoneColor, 0.6)})`,
          },
        }}
      />
    </Tooltip>
  );
}

