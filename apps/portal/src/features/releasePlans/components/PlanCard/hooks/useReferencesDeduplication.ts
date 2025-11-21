import type { PlanReference } from "../../../../types";

export function deduplicateReferences(
  newReferences: PlanReference[]
): PlanReference[] {
  const referencesMap = new Map<string, PlanReference>();
  for (const ref of newReferences) {
    if (ref.id) {
      // If ID exists, use it as key (prefer existing entry if duplicate)
      if (!referencesMap.has(ref.id)) {
        referencesMap.set(ref.id, ref);
      }
    } else {
      // If no ID, use a combination of type, title, date, and phaseId as key
      const key = `${ref.type}-${ref.title}-${ref.date || ""}-${
        ref.phaseId || ""
      }`;
      if (!referencesMap.has(key)) {
        referencesMap.set(key, ref);
      }
    }
  }
  return Array.from(referencesMap.values());
}

export function separateReferences(
  references: PlanReference[]
): {
  planLevelReferences: PlanReference[];
  milestoneReferences: PlanReference[];
} {
  const planLevelReferences: PlanReference[] = [];
  const milestoneReferences: PlanReference[] = [];

  for (const ref of references) {
    if (ref.type === "milestone" && ref.date) {
      // Milestone references with date should be saved
      milestoneReferences.push(ref);
      planLevelReferences.push(ref); // Also save milestone references
    } else if (!ref.date && !ref.phaseId) {
      // Plan-level references (without date/phaseId)
      planLevelReferences.push(ref);
    }
  }

  return { planLevelReferences, milestoneReferences };
}

