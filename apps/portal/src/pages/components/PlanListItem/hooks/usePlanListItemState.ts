import { useState, useRef } from "react";
import type { PlanCardHandle } from "../../../../features/releasePlans/components/PlanCard/PlanCard";

/**
 * Hook for managing PlanListItem state
 */
export function usePlanListItemState() {
  const planCardRef = useRef<PlanCardHandle>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  return {
    planCardRef,
    isSaving,
    setIsSaving,
    hasPendingChanges,
    setHasPendingChanges,
  };
}

