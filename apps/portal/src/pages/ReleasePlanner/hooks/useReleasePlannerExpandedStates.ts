import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

interface UseReleasePlannerExpandedStatesProps {
  localExpandedStates: Record<string, boolean>;
  setLocalExpandedStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

/**
 * Hook for syncing local expanded states with Redux state
 */
export function useReleasePlannerExpandedStates({
  localExpandedStates,
  setLocalExpandedStates,
}: UseReleasePlannerExpandedStatesProps) {
  const expandedStates = useAppSelector((s) => s.ui.planExpandedByPlanId ?? {});

  // Sync local state with Redux state
  useEffect(() => {
    setLocalExpandedStates((prev) => {
      const newState = { ...prev };
      for (const planId of Object.keys(expandedStates)) {
        if (expandedStates[planId] !== undefined) {
          newState[planId] = expandedStates[planId];
        }
      }
      return newState;
    });
  }, [expandedStates, setLocalExpandedStates]);

  return expandedStates;
}

