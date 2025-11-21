import { useCallback, useMemo, useRef } from "react";
import type { Plan } from "../../../types";

export function usePlanCardChanges(
  originalMetadata: Plan["metadata"],
  localMetadata: Plan["metadata"]
) {
  // Check if there are pending changes - optimized to avoid expensive JSON.stringify
  const hasPendingChanges = useCallback(() => {
    // Quick reference equality check first (fastest)
    if (originalMetadata === localMetadata) return false;

    // Compare key fields directly before falling back to JSON.stringify
    if (
      originalMetadata.name !== localMetadata.name ||
      originalMetadata.description !== localMetadata.description ||
      originalMetadata.status !== localMetadata.status ||
      originalMetadata.productId !== localMetadata.productId ||
      originalMetadata.itOwner !== localMetadata.itOwner ||
      originalMetadata.startDate !== localMetadata.startDate ||
      originalMetadata.endDate !== localMetadata.endDate
    ) {
      return true;
    }

    // For arrays/objects, check reference equality first
    if (
      originalMetadata.featureIds !== localMetadata.featureIds ||
      originalMetadata.components !== localMetadata.components ||
      originalMetadata.calendarIds !== localMetadata.calendarIds ||
      originalMetadata.references !== localMetadata.references ||
      originalMetadata.phases !== localMetadata.phases ||
      originalMetadata.milestones !== localMetadata.milestones
    ) {
      // Only use JSON.stringify if references differ
      return JSON.stringify(originalMetadata) !== JSON.stringify(localMetadata);
    }

    return false;
  }, [originalMetadata, localMetadata]);

  // Check if there are pending changes specifically in timeline (phases, milestones)
  const hasTimelineChanges = useMemo(() => {
    // Quick reference equality check first (fastest)
    if (
      originalMetadata.phases === localMetadata.phases &&
      originalMetadata.milestones === localMetadata.milestones
    ) {
      return false;
    }

    // Deep comparison only if references differ
    const originalStr = JSON.stringify({
      phases: originalMetadata.phases,
      milestones: originalMetadata.milestones,
    });
    const localStr = JSON.stringify({
      phases: localMetadata.phases,
      milestones: localMetadata.milestones,
    });

    return originalStr !== localStr;
  }, [
    originalMetadata.phases,
    originalMetadata.milestones,
    localMetadata.phases,
    localMetadata.milestones,
  ]);

  // Tab 0: General Info - compare fields directly (fastest, most common changes)
  const hasTab0Changes = useMemo(() => {
    return (
      originalMetadata.name !== localMetadata.name ||
      originalMetadata.description !== localMetadata.description ||
      originalMetadata.status !== localMetadata.status ||
      originalMetadata.productId !== localMetadata.productId ||
      originalMetadata.itOwner !== localMetadata.itOwner ||
      originalMetadata.startDate !== localMetadata.startDate ||
      originalMetadata.endDate !== localMetadata.endDate
    );
  }, [
    originalMetadata.name,
    originalMetadata.description,
    originalMetadata.status,
    originalMetadata.productId,
    originalMetadata.itOwner,
    originalMetadata.startDate,
    originalMetadata.endDate,
    localMetadata.name,
    localMetadata.description,
    localMetadata.status,
    localMetadata.productId,
    localMetadata.itOwner,
    localMetadata.startDate,
    localMetadata.endDate,
  ]);

  // Tab 1: Features - check reference first, then content
  const hasTab1Changes = useMemo(() => {
    if (originalMetadata.featureIds === localMetadata.featureIds) return false;
    const origSorted = [...(originalMetadata.featureIds || [])].sort((a, b) =>
      a.localeCompare(b)
    );
    const localSorted = [...(localMetadata.featureIds || [])].sort((a, b) =>
      a.localeCompare(b)
    );
    return (
      origSorted.length !== localSorted.length ||
      origSorted.some((id, idx) => id !== localSorted[idx])
    );
  }, [originalMetadata.featureIds, localMetadata.featureIds]);

  // Tab 2: Components - check reference first
  const hasTab2Changes = useMemo(() => {
    if (originalMetadata.components === localMetadata.components) return false;
    return (
      JSON.stringify(originalMetadata.components || []) !==
      JSON.stringify(localMetadata.components || [])
    );
  }, [originalMetadata.components, localMetadata.components]);

  // Tab 3: Calendars - check reference first, then content
  const hasTab3Changes = useMemo(() => {
    if (originalMetadata.calendarIds === localMetadata.calendarIds)
      return false;
    const origSorted = [...(originalMetadata.calendarIds || [])].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    const localSorted = [...(localMetadata.calendarIds || [])].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    return (
      origSorted.length !== localSorted.length ||
      origSorted.some((id, idx) => id !== localSorted[idx])
    );
  }, [originalMetadata.calendarIds, localMetadata.calendarIds]);

  // Tab 4: References - check reference first
  const hasTab4Changes = useMemo(() => {
    if (originalMetadata.references === localMetadata.references) return false;
    return (
      JSON.stringify(originalMetadata.references || []) !==
      JSON.stringify(localMetadata.references || [])
    );
  }, [originalMetadata.references, localMetadata.references]);

  // Combine all tab changes - use useMemo with stable reference
  const hasTabChanges = useMemo(
    () => ({
      0: hasTab0Changes,
      1: hasTab1Changes,
      2: hasTab2Changes,
      3: hasTab3Changes,
      4: hasTab4Changes,
    }),
    [
      hasTab0Changes,
      hasTab1Changes,
      hasTab2Changes,
      hasTab3Changes,
      hasTab4Changes,
    ]
  );

  // Memoize the hasTabChanges object reference to prevent unnecessary re-renders
  const hasTabChangesRef = useRef(hasTabChanges);
  const stableHasTabChanges = useMemo(() => {
    // Quick check: if references are the same, return immediately (fastest path)
    if (hasTabChangesRef.current === hasTabChanges) {
      return hasTabChangesRef.current;
    }

    // Compare if any value actually changed
    const changed =
      hasTabChangesRef.current[0] !== hasTabChanges[0] ||
      hasTabChangesRef.current[1] !== hasTabChanges[1] ||
      hasTabChangesRef.current[2] !== hasTabChanges[2] ||
      hasTabChangesRef.current[3] !== hasTabChanges[3] ||
      hasTabChangesRef.current[4] !== hasTabChanges[4];

    if (changed) {
      hasTabChangesRef.current = hasTabChanges;
      return hasTabChanges;
    }

    // Return the same reference if nothing changed
    return hasTabChangesRef.current;
  }, [hasTabChanges]);

  return {
    hasPendingChanges,
    hasTimelineChanges,
    stableHasTabChanges,
  };
}

