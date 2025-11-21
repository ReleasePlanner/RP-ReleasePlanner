import { useState, useRef, useEffect } from "react";
import type { Plan } from "../../../types";

export function usePlanCardState(plan: Plan) {
  const { metadata: originalMetadata } = plan;

  // Local state for pending changes - only saved when user clicks save button
  const [localMetadata, setLocalMetadata] = useState(originalMetadata);

  // Use ref to track the last synced updatedAt to prevent overwriting local edits
  const lastSyncedUpdatedAtRef = useRef<string | undefined>(plan.updatedAt);
  const isEditingRef = useRef(false);

  // Store scrollToDate function from GanttChart
  const [scrollToDateFn, setScrollToDateFn] = useState<
    ((date: string) => void) | null
  >(null);

  // Error snackbar state
  const [errorSnackbar, setErrorSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  // Sync local metadata when plan changes from external source
  // Only sync if the plan's updatedAt has changed (indicating a real update from server)
  // Don't sync if we're currently editing locally
  useEffect(() => {
    // Only sync if updatedAt changed and we're not currently editing
    const updatedAtChanged = plan.updatedAt !== lastSyncedUpdatedAtRef.current;

    if (updatedAtChanged && !isEditingRef.current) {
      console.log(
        "[PlanCard] Syncing localMetadata from originalMetadata (real update from server):",
        {
          planId: plan.id,
          planUpdatedAt: plan.updatedAt,
          lastSyncedUpdatedAt: lastSyncedUpdatedAtRef.current,
          originalPhasesCount: originalMetadata.phases?.length || 0,
          localPhasesCount: localMetadata?.phases?.length || 0,
        }
      );

      // Debug: Log references when plan changes
      if (
        originalMetadata.references &&
        originalMetadata.references.length > 0
      ) {
        console.log("[PlanCard] Syncing references from originalMetadata:", {
          count: originalMetadata.references.length,
          references: originalMetadata.references.map((r) => ({
            id: r.id,
            type: r.type,
            title: r.title,
          })),
        });
      } else {
        console.log("[PlanCard] No references in originalMetadata:", {
          references: originalMetadata.references,
          referencesLength: originalMetadata.references?.length,
        });
      }

      setLocalMetadata(originalMetadata);
      lastSyncedUpdatedAtRef.current = plan.updatedAt;
    }
  }, [
    plan.id,
    plan.updatedAt,
    originalMetadata,
    localMetadata?.phases?.length,
  ]);

  return {
    localMetadata,
    setLocalMetadata,
    originalMetadata,
    lastSyncedUpdatedAtRef,
    isEditingRef,
    scrollToDateFn,
    setScrollToDateFn,
    errorSnackbar,
    setErrorSnackbar,
  };
}

