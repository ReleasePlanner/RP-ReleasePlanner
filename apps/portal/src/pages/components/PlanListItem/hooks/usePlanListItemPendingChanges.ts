import { useEffect } from "react";
import type { PlanCardHandle } from "../../../../features/releasePlans/components/PlanCard/PlanCard";

interface UsePlanListItemPendingChangesProps {
  expanded: boolean;
  planCardRef: React.RefObject<PlanCardHandle | null>;
  setHasPendingChanges: (value: boolean) => void;
}

const PENDING_CHANGES_CHECK_INTERVAL = 500; // Check every 500ms

/**
 * Hook for tracking pending changes in PlanCard
 * Only checks when the item is expanded to avoid unnecessary work
 */
export function usePlanListItemPendingChanges({
  expanded,
  planCardRef,
  setHasPendingChanges,
}: UsePlanListItemPendingChangesProps) {
  useEffect(() => {
    if (!expanded) {
      setHasPendingChanges(false);
      return;
    }

    const interval = setInterval(() => {
      if (planCardRef.current) {
        setHasPendingChanges(planCardRef.current.hasPendingChanges());
      }
    }, PENDING_CHANGES_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [expanded, planCardRef, setHasPendingChanges]);
}

