import { useMemo } from "react";
import type { Plan } from "@/features/releasePlans/types";
import type { BasePhase } from "@/api/services/basePhases.service";
import { convertAPIPlanToLocal } from "@/features/releasePlans/lib/planConverters";

interface UseReleasePlannerPlansProps {
  apiPlans: unknown[];
  basePhases: BasePhase[];
}

/**
 * Hook for converting API plans to local format and ensuring default phases
 */
export function useReleasePlannerPlans({
  apiPlans,
  basePhases,
}: UseReleasePlannerPlansProps) {
  const plans = useMemo(() => {
    const convertedPlans = apiPlans.map(convertAPIPlanToLocal);

    // Ensure all plans have phases from basePhases if they don't have any
    return convertedPlans.map((plan) => {
      // If plan has no phases or empty phases array, initialize with base phases
      if (!plan.metadata.phases || plan.metadata.phases.length === 0) {
        if (basePhases.length > 0) {
          // Calculate default dates for base phases: all start the same day (plan startDate), each with one week duration
          const planStart = new Date(plan.metadata.startDate);

          // Create phases from base phases with unique IDs and default one-week dates
          plan.metadata.phases = basePhases.map((bp, index) => {
            // All phases start on the same day (plan start date)
            const phaseStart = new Date(planStart);

            // End date: one week (7 days) after start date
            const phaseEnd = new Date(phaseStart);
            phaseEnd.setDate(phaseEnd.getDate() + 7);

            return {
              id: `phase-${plan.id}-${Date.now()}-${index}-${bp.id}`,
              name: bp.name,
              color: bp.color,
              startDate: phaseStart.toISOString().slice(0, 10),
              endDate: phaseEnd.toISOString().slice(0, 10),
            };
          });
        }
      }
      return plan;
    });
  }, [apiPlans, basePhases]);

  return plans as Plan[];
}

