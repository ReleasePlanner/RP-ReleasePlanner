import { useCallback } from "react";
import { L } from "../../../../../utils/logging/simpleLogging";
import type {
  Plan,
  PlanStatus,
  PlanPhase,
  PlanComponent,
} from "../../../types";

interface UsePlanCardHandlersProps {
  plan: Plan;
  localMetadata: Plan["metadata"];
  setLocalMetadata: React.Dispatch<React.SetStateAction<Plan["metadata"]>>;
  handleToggleExpanded: () => void;
  expanded: boolean;
  handleLeftPercentChange: (percent: number) => void;
  handleAddPhase: (
    phases: PlanPhase[],
    callback: (updatedPhases: PlanPhase[]) => void
  ) => void;
  handlePhaseRangeChange: (
    phaseId: string,
    startDate: string,
    endDate: string,
    callback: (updatedPhases: PlanPhase[]) => void
  ) => void;
  openEdit: (phaseId: string) => void;
  log: { track: (event: string) => void };
}

export function usePlanCardHandlers({
  plan,
  localMetadata,
  setLocalMetadata,
  handleToggleExpanded,
  expanded,
  handleLeftPercentChange,
  handleAddPhase,
  handlePhaseRangeChange,
  openEdit,
  log,
}: UsePlanCardHandlersProps) {
  const handlePhaseUpdate = useCallback(
    (updatedPhases: PlanPhase[]) => {
      setLocalMetadata((prev) => ({
        ...prev,
        phases: updatedPhases,
      }));
    },
    [setLocalMetadata]
  );

  const handleToggleExpandedOptimized = () => {
    return L.track(
      () => {
        handleToggleExpanded();
        return { planId: plan.id, newState: !expanded };
      },
      expanded ? "plan_collapsed" : "plan_expanded",
      "PlanCard"
    );
  };

  const handleLeftPercentChangeOptimized = (percent: number) => {
    return L.time(
      () => {
        handleLeftPercentChange(percent);
        return { planId: plan.id, newPercent: percent };
      },
      "Layout resize",
      "PlanCard"
    );
  };

  const handleAddPhaseOptimized = (phasesToAdd: PlanPhase[]) => {
    return L.all(
      () => {
        handleAddPhase(phasesToAdd, handlePhaseUpdate);
        return { planId: plan.id, phasesCount: phasesToAdd.length };
      },
      {
        component: "PlanCard",
        message: `Adding ${phasesToAdd.length} phase(s)`,
        action: "add_phases",
        time: true,
      }
    );
  };

  const handleProductChange = useCallback(
    (productId: string) => {
      const validProductId = productId?.trim() || "";
      setLocalMetadata((prev) => ({
        ...prev,
        productId: validProductId || undefined,
      }));
      // Defer tracking to avoid blocking the UI update
      if (
        globalThis.window !== undefined &&
        "requestIdleCallback" in globalThis.window
      ) {
        requestIdleCallback(() => {
          L.track(
            () => ({ planId: plan.id, productId: validProductId }),
            "product_selected",
            "PlanCard"
          );
        });
      } else {
        setTimeout(() => {
          L.track(
            () => ({ planId: plan.id, productId: validProductId }),
            "product_selected",
            "PlanCard"
          );
        }, 0);
      }
    },
    [plan.id, setLocalMetadata]
  );

  const handleDescriptionChange = useCallback(
    (description: string) => {
      setLocalMetadata((prev) => ({
        ...prev,
        description: description || undefined,
      }));
    },
    [setLocalMetadata]
  );

  const handleStatusChange = useCallback(
    (status: PlanStatus) => {
      setLocalMetadata((prev) => ({
        ...prev,
        status,
      }));
    },
    [setLocalMetadata]
  );

  const handleITOwnerChange = useCallback(
    (itOwnerId: string) => {
      setLocalMetadata((prev) => ({
        ...prev,
        itOwner: itOwnerId || undefined,
      }));
    },
    [setLocalMetadata]
  );

  const handleStartDateChange = useCallback(
    (date: string) => {
      setLocalMetadata((prev) => ({
        ...prev,
        startDate: date,
      }));
    },
    [setLocalMetadata]
  );

  const handleEndDateChange = useCallback(
    (date: string) => {
      setLocalMetadata((prev) => ({
        ...prev,
        endDate: date,
      }));
    },
    [setLocalMetadata]
  );

  const openEditOptimized = useCallback(
    (phaseId: string) => {
      openEdit(phaseId);
      if (globalThis.requestIdleCallback === undefined) {
        setTimeout(() => log.track("open_edit_phase"), 0);
      } else {
        globalThis.requestIdleCallback(() => log.track("open_edit_phase"));
      }
    },
    [openEdit, log]
  );

  const handlePhaseRangeChangeOptimized = (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => {
    return L.time(
      () => {
        handlePhaseRangeChange(
          phaseId,
          startDate,
          endDate,
          handlePhaseUpdate
        );
        return { phaseId, startDate, endDate };
      },
      "Phase drag operation",
      "PlanCard"
    );
  };

  const handleFeatureIdsChange = useCallback(
    (newFeatureIds: string[]) => {
      setLocalMetadata((prev) => ({
        ...prev,
        featureIds: newFeatureIds,
      }));
    },
    [setLocalMetadata]
  );

  const handleComponentsChange = useCallback(
    (newComponents: PlanComponent[] | undefined) => {
      setLocalMetadata((prev) => ({
        ...prev,
        components: newComponents ?? [],
      }));
    },
    [setLocalMetadata]
  );

  const handleReorderPhases = useCallback(
    (reorderedPhases: PlanPhase[]) => {
      setLocalMetadata((prev) => ({
        ...prev,
        phases: reorderedPhases,
      }));
    },
    [setLocalMetadata]
  );

  const handleCalendarIdsChange = useCallback(
    (newCalendarIds: string[]) => {
      setLocalMetadata((prev) => ({
        ...prev,
        calendarIds: newCalendarIds,
      }));
    },
    [setLocalMetadata]
  );

  const handleIndicatorIdsChange = useCallback(
    (newIndicatorIds: string[]) => {
      setLocalMetadata((prev) => ({
        ...prev,
        indicatorIds: newIndicatorIds || [],
      }));
    },
    [setLocalMetadata]
  );

  const handleTeamIdsChange = useCallback(
    (newTeamIds: string[]) => {
      console.log('[usePlanCardHandlers] handleTeamIdsChange called:', {
        newTeamIds,
        newTeamIdsCount: newTeamIds.length,
        newTeamIdsIsArray: Array.isArray(newTeamIds),
      });
      setLocalMetadata((prev) => {
        const updated = {
          ...prev,
          teamIds: newTeamIds || [],
        };
        console.log('[usePlanCardHandlers] Updating localMetadata:', {
          prevTeamIds: prev.teamIds,
          prevTeamIdsCount: prev.teamIds?.length || 0,
          newTeamIds: updated.teamIds,
          newTeamIdsCount: updated.teamIds?.length || 0,
        });
        return updated;
      });
    },
    [setLocalMetadata]
  );

  const handleLeadIdChange = useCallback(
    (newLeadId: string) => {
      setLocalMetadata((prev) => ({
        ...prev,
        leadId: newLeadId || undefined,
      }));
    },
    [setLocalMetadata]
  );

  const handleNameChange = useCallback(
    (newName: string) => {
      setLocalMetadata((prev) => ({
        ...prev,
        name: newName,
      }));
    },
    [setLocalMetadata]
  );

  return {
    handleToggleExpandedOptimized,
    handleLeftPercentChangeOptimized,
    handleAddPhaseOptimized,
    handleProductChange,
    handleDescriptionChange,
    handleStatusChange,
    handleITOwnerChange,
    handleStartDateChange,
    handleEndDateChange,
    openEditOptimized,
    handlePhaseRangeChangeOptimized,
    handleReorderPhases,
    handleFeatureIdsChange,
    handleComponentsChange,
    handleCalendarIdsChange,
    handleIndicatorIdsChange,
    handleTeamIdsChange,
    handleLeadIdChange,
    handleNameChange,
    handlePhaseUpdate,
  };
}

