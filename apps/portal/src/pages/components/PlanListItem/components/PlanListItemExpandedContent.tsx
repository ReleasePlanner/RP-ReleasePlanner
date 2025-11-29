import { memo, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { Plan as LocalPlan } from "../../../../features/releasePlans/types";
import type { PlanCardHandle } from "../../../../features/releasePlans/components/PlanCard/PlanCard";
import { PlanCardLoadingFallback } from "./PlanCardLoadingFallback";

// Lazy load PlanCard only when needed
// Using dynamic import with webpack magic comment for better chunking and prefetching
const PlanCard = lazy(
  () =>
    import(
      /* webpackChunkName: "plan-card" */
      /* webpackPrefetch: true */
      "../../../../features/releasePlans/components/PlanCard/PlanCard"
    )
);

export type PlanListItemExpandedContentProps = {
  readonly plan: LocalPlan;
  readonly planCardRef: React.RefObject<PlanCardHandle | null>;
  readonly expandedContentStyles: SxProps<Theme>;
  readonly loadingFallbackStyles: SxProps<Theme>;
};

/**
 * Component for the expanded content (PlanCard) with lazy loading
 * Optimized with prefetching and enhanced loading feedback
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
            <PlanCardLoadingFallback
              plan={plan}
              loadingFallbackStyles={loadingFallbackStyles}
            />
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
