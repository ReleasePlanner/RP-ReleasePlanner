import type { PlanReference, PlanMilestone } from "../../../../types";

export function syncMilestonesFromReferences(
  milestoneReferences: PlanReference[]
): PlanMilestone[] {
  return milestoneReferences
    .filter((ref): ref is PlanReference & { date: string } => !!ref.date)
    .map((ref) => ({
      id:
        ref.id ||
        `milestone-${ref.phaseId || ""}-${ref.date}-${Date.now()}`,
      date: ref.date,
      name: ref.title,
      description: ref.description,
      phaseId: ref.phaseId,
    }));
}

