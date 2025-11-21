import { useCallback, useMemo } from "react";
import type { Plan, PlanReference, PlanMilestone } from "../../../types";
import {
  deduplicateReferences,
  separateReferences,
  syncMilestonesFromReferences,
} from "./useReferencesDeduplication";

export function usePlanCardReferences(
  metadata: Plan["metadata"],
  setLocalMetadata: React.Dispatch<React.SetStateAction<Plan["metadata"]>>
) {
  const handleReferencesChange = useCallback(
    (newReferences: PlanReference[]) => {
      // Deduplicate references by ID to prevent duplicates
      const deduplicatedReferences = deduplicateReferences(newReferences);

      // Separate references: plan-level (no date/phaseId) and milestone references (with date)
      const { planLevelReferences, milestoneReferences } =
        separateReferences(deduplicatedReferences);

      // Sync milestones from milestone references
      const syncedMilestones =
        syncMilestonesFromReferences(milestoneReferences);

      setLocalMetadata((prev) => ({
        ...prev,
        references: planLevelReferences,
        milestones: syncedMilestones,
      }));
    },
    [setLocalMetadata]
  );

  // Consolidate all references: plan references + milestones
  const consolidatedReferences = useMemo(() => {
    const allReferences: PlanReference[] = [];

    // 1. Add ALL plan-level references (including milestone references)
    const planReferences = metadata.references || [];

    console.log("[PlanCard] consolidatedReferences - metadata.references:", {
      references: metadata.references,
      referencesLength: metadata.references?.length,
      planReferencesLength: planReferences.length,
      planReferences: planReferences.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
      })),
    });

    allReferences.push(...planReferences);

    // 2. Generate references from plan-level milestones that don't already have milestone-type references
    const milestones = metadata.milestones || [];
    const milestoneRefKeys = new Set(
      (metadata.references || [])
        .filter((ref) => ref.type === "milestone" && ref.date)
        .map((ref) => `${ref.phaseId || ""}-${ref.date}`)
    );

    for (const milestone of milestones) {
      const milestoneKey = `${milestone.phaseId || ""}-${milestone.date}`;
      if (!milestoneRefKeys.has(milestoneKey)) {
        allReferences.push({
          id: `ref-milestone-${milestone.id}`,
          type: "note",
          title: `Milestone: ${milestone.name} - ${milestone.date}`,
          description:
            milestone.description || `Milestone del plan en ${milestone.date}`,
          date: milestone.date,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Sort by date (most recent first), then by createdAt
    return allReferences.sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      const createdA = a.createdAt || "";
      const createdB = b.createdAt || "";
      return createdB.localeCompare(createdA);
    });
  }, [metadata.references, metadata.milestones]);

  return {
    handleReferencesChange,
    consolidatedReferences,
  };
}

