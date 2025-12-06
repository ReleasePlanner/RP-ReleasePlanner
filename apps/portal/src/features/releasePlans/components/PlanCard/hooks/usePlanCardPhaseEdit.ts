import { useCallback } from "react";
import type { PlanPhase, Plan } from "../../../types";

export function usePlanCardPhaseEdit(
  metadata: Plan["metadata"],
  setLocalMetadata: React.Dispatch<React.SetStateAction<Plan["metadata"]>>,
  setEditOpen: (open: boolean) => void,
  isEditingRef: React.MutableRefObject<boolean>
) {
  const handlePhaseSave = useCallback(
    (updatedPhase: PlanPhase) => {
      isEditingRef.current = true;

      console.log("[PlanCard] Saving edited phase to memory:", {
        updatedPhaseId: updatedPhase.id,
        updatedPhaseName: updatedPhase.name,
        updatedPhaseStartDate: updatedPhase.startDate,
        updatedPhaseEndDate: updatedPhase.endDate,
      });

      if (
        !updatedPhase.id ||
        !updatedPhase.name ||
        !updatedPhase.startDate ||
        !updatedPhase.endDate
      ) {
        console.error(
          "[PlanCard] Cannot save phase - missing required fields:",
          {
            phase: updatedPhase,
            hasId: !!updatedPhase.id,
            hasName: !!updatedPhase.name,
            hasStartDate: !!updatedPhase.startDate,
            hasEndDate: !!updatedPhase.endDate,
          }
        );
        isEditingRef.current = false;
        return;
      }

      // ⚡ DISCONNECTED OBJECTS PATTERN: Update only in memory
      // Use functional update to access current localMetadata state
      setLocalMetadata((prev) => {
        const currentPhases = prev.phases || [];
        const existingPhaseIndex = currentPhases.findIndex(
          (p) => p.id === updatedPhase.id
        );

        if (existingPhaseIndex < 0) {
          console.error("[PlanCard] Phase not found for update:", {
            phaseId: updatedPhase.id,
            phaseName: updatedPhase.name,
            existingPhases: currentPhases.map((p) => ({
              id: p.id,
              name: p.name,
            })),
          });
          isEditingRef.current = false;
          return prev; // Return unchanged state
        }

        const updatedPhases = [...currentPhases];
        updatedPhases[existingPhaseIndex] = updatedPhase;

        console.log("[PlanCard] Phase updated in memory:", {
          phaseId: updatedPhase.id,
          phaseName: updatedPhase.name,
          index: existingPhaseIndex,
          totalPhases: updatedPhases.length,
        });

        const newMetadata = {
          ...prev,
          phases: updatedPhases,
        };
        
        console.log("[PlanCard] Updated localMetadata with phases:", {
          phaseCount: newMetadata.phases?.length || 0,
          phases: newMetadata.phases?.map((p) => ({
            id: p.id,
            name: p.name,
            startDate: p.startDate,
            endDate: p.endDate,
          })),
        });
        
        return newMetadata;
      });

      setEditOpen(false);

      setTimeout(() => {
        isEditingRef.current = false;
      }, 100);
    },
    [setLocalMetadata, setEditOpen, isEditingRef]
  );

  return { handlePhaseSave };
}

