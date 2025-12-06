import { useAppSelector } from "@/store/hooks";

/**
 * Hook for getting expanded states from Redux
 * Simplified: No bidirectional sync to prevent infinite loops
 * Local state is updated optimistically in handlePlanToggle, and Redux is the source of truth
 */
export function useReleasePlannerExpandedStates() {
  const expandedStates = useAppSelector((s) => s.ui.planExpandedByPlanId ?? {});
  return expandedStates;
}

