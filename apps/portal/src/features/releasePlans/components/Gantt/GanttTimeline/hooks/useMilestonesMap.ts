import { useMemo } from "react";
import type { PlanMilestone } from "../../../../types";

export function useMilestonesMap(
  milestones: PlanMilestone[]
): Map<string, PlanMilestone> {
  return useMemo(() => {
    const map = new Map<string, PlanMilestone>();
    for (const milestone of milestones) {
      map.set(milestone.date, milestone);
    }
    return map;
  }, [milestones]);
}

