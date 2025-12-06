import { useCallback } from "react";
import type { PlanMilestone } from "../../../types";

export function useHandleDayClick(
  milestones: PlanMilestone[],
  onMilestoneAdd?: (milestone: PlanMilestone) => void,
  onMilestoneUpdate?: (milestone: PlanMilestone) => void
) {
  return useCallback(
    (date: string) => {
      const existingMilestone = milestones.find((m) => m.date === date);

      if (existingMilestone) {
        if (onMilestoneUpdate) {
          // Could open edit dialog here
        }
      } else {
        if (onMilestoneAdd) {
          const newMilestone: PlanMilestone = {
            id: `milestone-${Date.now()}`,
            date,
            name: `Milestone ${date}`,
          };
          onMilestoneAdd(newMilestone);
        }
      }
    },
    [milestones, onMilestoneAdd, onMilestoneUpdate]
  );
}

