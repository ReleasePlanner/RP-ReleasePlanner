import { useCallback } from "react";
import type { BasePhase } from "../../../../../../../api/services/basePhases.service";
import type { PlanPhase } from "../../../../types";

/**
 * Calculate sequential dates for phases
 * Each phase starts where the previous one ends (or at plan start if no phases exist)
 */
function calculateSequentialDates(
  existingPhases: PlanPhase[],
  planStartDate?: string,
  planEndDate?: string,
  phaseDurationDays: number = 1
): { startDate: string; endDate: string } {
  let phaseStart: Date;
  
  if (existingPhases.length === 0) {
    // No existing phases - start from plan start date or today
    if (planStartDate) {
      phaseStart = new Date(planStartDate);
    } else {
      phaseStart = new Date();
      phaseStart.setHours(0, 0, 0, 0);
    }
  } else {
    // Start from the end of the last existing phase
    const lastPhase = existingPhases[existingPhases.length - 1];
    if (lastPhase.endDate) {
      phaseStart = new Date(lastPhase.endDate);
      // Add 1 day to avoid overlap (end date is inclusive, so next phase starts the day after)
      phaseStart.setDate(phaseStart.getDate() + 1);
    } else if (planStartDate) {
      // Fallback: use plan start if last phase has no end date
      phaseStart = new Date(planStartDate);
    } else {
      phaseStart = new Date();
      phaseStart.setHours(0, 0, 0, 0);
    }
  }
  
  const phaseEnd = new Date(phaseStart);
  phaseEnd.setDate(phaseEnd.getDate() + phaseDurationDays);
  
  // Ensure end date doesn't exceed plan end date
  if (planEndDate) {
    const planEnd = new Date(planEndDate);
    if (phaseEnd.getTime() > planEnd.getTime()) {
      phaseEnd.setTime(planEnd.getTime());
    }
  }
  
  return {
    startDate: phaseStart.toISOString().slice(0, 10),
    endDate: phaseEnd.toISOString().slice(0, 10),
  };
}

export function useAddPhaseSubmit(
  tabValue: number,
  selectedBasePhaseIds: Set<string>,
  basePhases: BasePhase[],
  newPhaseName: string,
  newPhaseColor: string,
  validatePhaseName: (name: string) => boolean,
  existingPhases: PlanPhase[] = [],
  planStartDate?: string,
  planEndDate?: string
) {
  const handleSubmit = useCallback(
    (onSubmit: (phases: PlanPhase[]) => void, onClose: () => void) => {
      const phasesToAdd: PlanPhase[] = [];

      if (tabValue === 0) {
        // Add selected base phases sequentially
        const selectedBasePhases = Array.from(selectedBasePhaseIds)
          .map((phaseId) => basePhases.find((bp) => bp.id === phaseId))
          .filter((bp): bp is BasePhase => bp !== undefined);

        // Calculate dates for each phase sequentially
        let currentPhases = [...existingPhases];
        
        for (const [index, basePhase] of selectedBasePhases.entries()) {
          const { startDate, endDate } = calculateSequentialDates(
            currentPhases,
            planStartDate,
            planEndDate,
            1 // Default 1 day per phase
          );
          
          const newPhase: PlanPhase = {
            id: `phase-${Date.now()}-${index}-${basePhase.id}`,
            name: basePhase.name,
            color: basePhase.color,
            startDate,
            endDate,
          };
          
          phasesToAdd.push(newPhase);
          // Update current phases for next iteration to calculate sequential dates
          currentPhases = [...currentPhases, newPhase];
        }
      } else {
        // Add new custom phase sequentially after existing phases
        if (!validatePhaseName(newPhaseName)) return;

        const { startDate, endDate } = calculateSequentialDates(
          existingPhases,
          planStartDate,
          planEndDate,
          1 // Default 1 day per phase
        );
        
        phasesToAdd.push({
          id: `phase-${Date.now()}-custom`,
          name: newPhaseName.trim(),
          color: newPhaseColor,
          startDate,
          endDate,
        });
      }

      if (phasesToAdd.length > 0) {
        onSubmit(phasesToAdd);
        onClose();
      }
    },
    [
      tabValue,
      selectedBasePhaseIds,
      basePhases,
      newPhaseName,
      newPhaseColor,
      validatePhaseName,
      existingPhases,
      planStartDate,
      planEndDate,
    ]
  );

  return { handleSubmit };
}

