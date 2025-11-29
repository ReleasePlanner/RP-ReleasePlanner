import { useEffect } from "react";
import type { PlanCardHandle } from "../../../../features/releasePlans/components/PlanCard/PlanCard";
import { PENDING_CHANGES_CHECK_INTERVAL } from "../constants";

interface UsePlanListItemPendingChangesProps {
  expanded: boolean;
  planCardRef: React.RefObject<PlanCardHandle | null>;
  setHasPendingChanges: (value: boolean) => void;
}

/**
 * Hook for tracking pending changes in PlanCard
 * Only checks when the item is expanded to avoid unnecessary work
 * Optimized: Uses requestAnimationFrame for better performance and reduced CPU usage
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

    // Use requestAnimationFrame for smoother performance
    // This syncs with browser repaint cycles and reduces CPU usage
    let rafId: number;
    let lastCheckTime = 0;

    const checkChanges = (currentTime: number) => {
      // Throttle checks to PENDING_CHANGES_CHECK_INTERVAL
      if (currentTime - lastCheckTime >= PENDING_CHANGES_CHECK_INTERVAL) {
        if (planCardRef.current) {
          setHasPendingChanges(planCardRef.current.hasPendingChanges());
        }
        lastCheckTime = currentTime;
      }
      rafId = requestAnimationFrame(checkChanges);
    };

    rafId = requestAnimationFrame(checkChanges);
    return () => cancelAnimationFrame(rafId);
  }, [expanded, planCardRef, setHasPendingChanges]);
}

