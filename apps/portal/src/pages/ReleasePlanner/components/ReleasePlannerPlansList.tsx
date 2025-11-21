import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { Plan } from "@/features/releasePlans/types";
import type { PlanStatus } from "@/features/releasePlans/types";
import PlanListItem from "../../components/PlanListItem";

export type ReleasePlannerPlansListProps = {
  readonly plans: Plan[];
  readonly localExpandedStates: Record<string, boolean>;
  readonly expandedStates: Record<string, boolean>;
  readonly onToggle: (planId: string) => void;
  readonly onDelete: (plan: Plan, event: React.MouseEvent) => void;
  readonly onCopyId: (planId: string, event: React.MouseEvent) => void;
  readonly onContextMenu: (event: React.MouseEvent, plan: Plan) => void;
  readonly getStatusChipProps: (status: PlanStatus) => {
    label: string;
    color: "info" | "primary" | "success" | "warning" | "default";
  };
};

/**
 * Component for displaying plans in list view
 */
export const ReleasePlannerPlansList = memo(function ReleasePlannerPlansList({
  plans,
  localExpandedStates,
  expandedStates,
  onToggle,
  onDelete,
  onCopyId,
  onContextMenu,
  getStatusChipProps,
}: ReleasePlannerPlansListProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {plans.map((p, index) => {
        // Use local state for instant UI feedback, fallback to Redux state
        const expanded = localExpandedStates[p.id] ?? expandedStates[p.id] ?? false;

        return (
          <PlanListItem
            key={p.id}
            plan={p}
            index={index}
            totalPlans={plans.length}
            expanded={expanded}
            onToggle={onToggle}
            onDelete={onDelete}
            onCopyId={onCopyId}
            onContextMenu={onContextMenu}
            getStatusChipProps={getStatusChipProps}
          />
        );
      })}
    </Paper>
  );
});

