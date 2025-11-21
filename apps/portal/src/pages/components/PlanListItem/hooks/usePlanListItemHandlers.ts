import { useCallback } from "react";
import type { Plan as LocalPlan } from "../../../../features/releasePlans/types";
import type { PlanCardHandle } from "../../../../features/releasePlans/components/PlanCard/PlanCard";
import { getUserErrorMessage } from "../../../../api/resilience/ErrorHandler";

interface UsePlanListItemHandlersProps {
  plan: LocalPlan;
  planCardRef: React.RefObject<PlanCardHandle | null>;
  setIsSaving: (value: boolean) => void;
  onToggle: (planId: string) => void;
  onDelete: (plan: LocalPlan, event: React.MouseEvent) => void;
  onCopyId: (planId: string, event: React.MouseEvent) => void;
  onContextMenu: (event: React.MouseEvent, plan: LocalPlan) => void;
}

/**
 * Hook for managing PlanListItem event handlers
 */
export function usePlanListItemHandlers({
  plan,
  planCardRef,
  setIsSaving,
  onToggle,
  onDelete,
  onCopyId,
  onContextMenu,
}: UsePlanListItemHandlersProps) {
  const handleToggle = useCallback(() => {
    onToggle(plan.id);
  }, [plan.id, onToggle]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      onDelete(plan, e);
    },
    [plan, onDelete]
  );

  const handleCopyId = useCallback(
    (e: React.MouseEvent) => {
      onCopyId(plan.id, e);
    },
    [plan.id, onCopyId]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      onContextMenu(e, plan);
    },
    [plan, onContextMenu]
  );

  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent expanding/collapsing
      if (!planCardRef.current) return;

      setIsSaving(true);
      planCardRef.current
        .saveAll()
        .catch((error: unknown) => {
          console.error("Error saving plan:", error);
          const userMessage = getUserErrorMessage(error);
          // TODO: Replace alert with toast notification
          if (globalThis.window?.alert) {
            globalThis.window.alert(userMessage);
          }
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [planCardRef, setIsSaving]
  );

  return {
    handleToggle,
    handleDelete,
    handleCopyId,
    handleContextMenu,
    handleSave,
  };
}

