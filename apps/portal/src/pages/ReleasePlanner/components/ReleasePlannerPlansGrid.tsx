import { memo } from "react";
import { Box } from "@mui/material";
import type { Plan } from "@/features/releasePlans/types";
import { PlanGridCard } from "./PlanGridCard";

export type ReleasePlannerPlansGridProps = {
  readonly plans: Plan[];
};

/**
 * Component for displaying plans in grid view
 * Uses compact cards showing key information about each plan
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
          sm: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          md: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          lg: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
          xl: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
        },
        gap: { xs: 1.5, sm: 2 },
        width: "100%",
      }}
    >
      {plans.map((p) => (
        <PlanGridCard key={p.id} plan={p} />
      ))}
    </Box>
  );
});

