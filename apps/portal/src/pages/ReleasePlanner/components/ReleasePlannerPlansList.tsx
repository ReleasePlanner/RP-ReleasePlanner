import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { Plan, PlanStatus } from "@/features/releasePlans/types";
import type { StatusChipProps } from "@/features/releasePlans/lib/planStatus";
import PlanListItem from "../../components/PlanListItem";

export type ReleasePlannerPlansListProps = {
  readonly plans: Plan[];
  readonly expandedStates: Record<string, boolean>;
  readonly onToggle: (planId: string) => void;
  readonly onDelete: (plan: Plan, event: React.MouseEvent) => void;
  readonly onCopyId: (planId: string, event: React.MouseEvent) => void;
  readonly onContextMenu: (event: React.MouseEvent, plan: Plan) => void;
  readonly getStatusChipProps: (status: PlanStatus) => StatusChipProps;
};

/**
 * Component for displaying plans in list view
 * Optimized with custom comparison function to prevent unnecessary re-renders
 */
export const ReleasePlannerPlansList = memo(
  function ReleasePlannerPlansList({
    plans,
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
          // Use Redux state as source of truth
          const expanded = expandedStates[p.id] ?? false;

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
  },
  // Custom comparison function to optimize re-renders
  (prevProps, nextProps) => {
    // Quick length check
    if (prevProps.plans.length !== nextProps.plans.length) return false;

    // Reference equality checks for callbacks (should be stable with useCallback)
    if (
      prevProps.onToggle !== nextProps.onToggle ||
      prevProps.onDelete !== nextProps.onDelete ||
      prevProps.onCopyId !== nextProps.onCopyId ||
      prevProps.onContextMenu !== nextProps.onContextMenu ||
      prevProps.getStatusChipProps !== nextProps.getStatusChipProps
    ) {
      return false;
    }

    // Reference equality for expanded states
    if (prevProps.expandedStates !== nextProps.expandedStates) {
      return false;
    }

    // Quick reference check for plans array
    if (prevProps.plans !== nextProps.plans) {
      // If references differ, check if any plan reference changed
      for (let i = 0; i < prevProps.plans.length; i++) {
        if (prevProps.plans[i] !== nextProps.plans[i]) {
          return false;
        }
      }
    }

    return true;
  }
);
