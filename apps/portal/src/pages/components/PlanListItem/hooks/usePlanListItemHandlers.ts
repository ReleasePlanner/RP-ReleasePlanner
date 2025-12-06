import { useCallback } from "react";
import type { Plan as LocalPlan, ReleaseStatus } from "../../../../features/releasePlans/types";
import type { PlanCardHandle } from "../../../../features/releasePlans/components/PlanCard/PlanCard";
import { getUserErrorMessage } from "../../../../api/resilience/ErrorHandler";
import { useUpdatePlan } from "../../../../api/hooks/usePlans";
import { useQueryClient } from "@tanstack/react-query";

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
  const updatePlanMutation = useUpdatePlan();
  const queryClient = useQueryClient();

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

  const handleReleaseStatusChange = useCallback(
    async (releaseStatus: ReleaseStatus) => {
      // Default to "To Be Defined" if not provided
      const statusToSave = releaseStatus || "To Be Defined";
      
      // Don't update if the value hasn't changed
      if (statusToSave === (plan.metadata.releaseStatus || "To Be Defined")) {
        return;
      }

      try {
        await updatePlanMutation.mutateAsync({
          id: plan.id,
          data: {
            releaseStatus: statusToSave,
            updatedAt: plan.updatedAt,
          },
        });
        // Invalidate queries to refresh the plan data - only invalidate specific plan
        queryClient.invalidateQueries({ queryKey: ["plans", plan.id] });
        queryClient.invalidateQueries({ queryKey: ["plans"] });
      } catch (error: unknown) {
        console.error("Error updating release status:", error);
        const userMessage = getUserErrorMessage(error);
        if (globalThis.window?.alert) {
          globalThis.window.alert(userMessage);
        }
      }
    },
    [plan.id, plan.metadata.releaseStatus, plan.updatedAt, updatePlanMutation, queryClient]
  );

  return {
    handleToggle,
    handleDelete,
    handleCopyId,
    handleContextMenu,
    handleSave,
    handleReleaseStatusChange,
  };
}

