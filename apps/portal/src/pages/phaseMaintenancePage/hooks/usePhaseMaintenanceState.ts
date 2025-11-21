import { useAppSelector } from "@/store/hooks";

/**
 * Hook for managing PhaseMaintenancePage state
 */
export function usePhaseMaintenanceState() {
  const phases = useAppSelector((state) => state.basePhases.phases);

  return {
    phases,
  };
}

