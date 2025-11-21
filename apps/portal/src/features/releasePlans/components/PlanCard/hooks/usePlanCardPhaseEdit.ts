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

      console.log("[PlanCard] Saving edited phase:", {
        updatedPhaseId: updatedPhase.id,
        updatedPhaseName: updatedPhase.name,
        updatedPhaseStartDate: updatedPhase.startDate,
        updatedPhaseEndDate: updatedPhase.endDate,
        existingPhases: (metadata.phases || []).map((p) => ({
          id: p.id,
          name: p.name,
          startDate: p.startDate,
          endDate: p.endDate,
        })),
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

      const existingPhaseIndex = (metadata.phases || []).findIndex(
        (p) => p.id === updatedPhase.id
      );

      if (existingPhaseIndex < 0) {
        console.error("[PlanCard] Phase not found for update:", {
          phaseId: updatedPhase.id,
          phaseName: updatedPhase.name,
          existingPhases: (metadata.phases || []).map((p) => ({
            id: p.id,
            name: p.name,
          })),
        });
        isEditingRef.current = false;
        return;
      }

      const updatedPhases = [...(metadata.phases || [])];
      updatedPhases[existingPhaseIndex] = updatedPhase;

      console.log("[PlanCard] Phase updated successfully:", {
        phaseId: updatedPhase.id,
        phaseName: updatedPhase.name,
        index: existingPhaseIndex,
        totalPhases: updatedPhases.length,
      });

      setLocalMetadata((prev) => {
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
    [metadata.phases, setLocalMetadata, setEditOpen, isEditingRef]
  );

  return { handlePhaseSave };
}

