import { memo, lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import type { Plan as LocalPlan } from "../../../../features/releasePlans/types";
import type { PlanCardHandle } from "../../../../features/releasePlans/components/PlanCard/PlanCard";

// Lazy load PlanCard only when needed
const PlanCard = lazy(
  () => import("../../../../features/releasePlans/components/PlanCard/PlanCard")
);

export type PlanListItemExpandedContentProps = {
  readonly plan: LocalPlan;
  readonly planCardRef: React.RefObject<PlanCardHandle | null>;
  readonly expandedContentStyles: Record<string, unknown>;
  readonly loadingFallbackStyles: Record<string, unknown>;
};

/**
 * Component for the expanded content (PlanCard) with lazy loading
 */
export const PlanListItemExpandedContent = memo(
  function PlanListItemExpandedContent({
    plan,
    planCardRef,
    expandedContentStyles,
    loadingFallbackStyles,
  }: PlanListItemExpandedContentProps) {
    return (
      <Box sx={expandedContentStyles}>
        <Suspense
          fallback={
            <Box sx={loadingFallbackStyles}>
              <CircularProgress size={24} />
            </Box>
          }
        >
          <Box sx={{ width: "100%", minWidth: 0 }}>
            <PlanCard ref={planCardRef} plan={plan} />
          </Box>
        </Suspense>
      </Box>
    );
  }
);

