import { memo } from "react";
import { Stack, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { Plan as LocalPlan, PlanStatus } from "../../../../features/releasePlans/types";
import { formatCompactDate } from "../../../../features/releasePlans/lib/date";
import type { StatusChipProps } from "../../../../features/releasePlans/lib/planStatus";

export type PlanListItemInfoProps = {
  readonly plan: LocalPlan;
  readonly getStatusChipProps: (status: PlanStatus) => StatusChipProps;
  readonly planNameStyles: SxProps<Theme>;
  readonly infoStackStyles: SxProps<Theme>;
  readonly statusChipStyles: SxProps<Theme>;
  readonly infoTextStyles: SxProps<Theme>;
};

/**
 * Component for displaying plan information (name, status, dates, counts)
 * Optimized: Removed unnecessary useMemo for simple calculations
 */
export const PlanListItemInfo = memo(function PlanListItemInfo({
  plan,
  getStatusChipProps,
  planNameStyles,
  infoStackStyles,
  statusChipStyles,
  infoTextStyles,
}: PlanListItemInfoProps) {
  // Simple calculations - useMemo overhead is greater than the calculation itself
  const phasesCount = plan.metadata.phases?.length ?? 0;
  const tasksCount = plan.tasks?.length ?? 0;

  return (
    <>
      {/* Plan Name */}
      <Typography variant="body2" sx={planNameStyles}>
        {plan.metadata.name}
      </Typography>

      {/* Info Chips - Simple, no icons */}
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={infoStackStyles}
      >
        {/* Status Chip */}
        <Chip
          {...getStatusChipProps(plan.metadata.status)}
          size="small"
          sx={statusChipStyles}
        />

        {/* Owner - Simple text */}
        <Typography
          variant="caption"
          sx={{
            ...infoTextStyles,
            display: { xs: "none", sm: "block" },
          }}
        >
          {plan.metadata.owner}
        </Typography>

        {/* Date Range - Simple text */}
        <Typography variant="caption" sx={infoTextStyles}>
          {formatCompactDate(plan.metadata.startDate)} -{" "}
          {formatCompactDate(plan.metadata.endDate)}
        </Typography>

        {/* Phases Count - Simple text */}
        {phasesCount > 0 && (
          <Typography variant="caption" sx={infoTextStyles}>
            {phasesCount} {phasesCount === 1 ? "phase" : "phases"}
          </Typography>
        )}

        {/* Tasks Count - Simple text */}
        {tasksCount > 0 && (
          <Typography
            variant="caption"
            sx={{
              ...infoTextStyles,
              display: { xs: "none", md: "block" },
            }}
          >
            {tasksCount} {tasksCount === 1 ? "task" : "tasks"}
          </Typography>
        )}
      </Stack>
    </>
  );
});

