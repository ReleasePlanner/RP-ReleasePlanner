import { memo } from "react";
import { Box } from "@mui/material";
import type { Plan } from "@/features/releasePlans/types";
import PlanCard from "@/features/releasePlans/components/PlanCard/PlanCard";

export type ReleasePlannerPlansGridProps = {
  readonly plans: Plan[];
};

/**
 * Component for displaying plans in grid view
 */
export const ReleasePlannerPlansGrid = memo(function ReleasePlannerPlansGrid({
  plans,
}: ReleasePlannerPlansGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(auto-fill, minmax(min(100%, 350px), 1fr))",
          md: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))",
          lg: "repeat(auto-fill, minmax(min(100%, 450px), 1fr))",
          xl: "repeat(auto-fill, minmax(min(100%, 500px), 1fr))",
        },
        gap: { xs: 1.5, sm: 2 },
        width: "100%",
      }}
    >
      {plans.map((p) => (
        <Box
          key={p.id}
          sx={{
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <PlanCard plan={p} />
        </Box>
      ))}
    </Box>
  );
});

