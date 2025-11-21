import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addBasePhase } from "@/features/releasePlans/basePhasesSlice";

/**
 * Hook for managing PhaseMaintenancePage event handlers
 */
export function usePhaseMaintenanceHandlers() {
  const dispatch = useAppDispatch();

  const handleAddPhase = useCallback(() => {
    dispatch(
      addBasePhase({
        id: `base-${Date.now()}`,
        name: "New phase",
        color: "#185ABD",
      })
    );
  }, [dispatch]);

  return {
    handleAddPhase,
  };
}

