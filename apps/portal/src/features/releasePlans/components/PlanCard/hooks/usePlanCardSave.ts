import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFeatures } from "../../../../../api/hooks";
import type { Plan } from "../../../types";
import {
  prepareTabData,
  getErrorMessage,
  validateComponentsBeforeSave,
  handlePostSaveOperations,
  handleRetryLogic,
  validatePhases,
  validatePhaseData,
} from "./index";
import {
  createFullUpdateDto,
  createPartialUpdateDto,
} from "../../../lib/planConverters";
import { categorizeError } from "../../../../../api/resilience/ErrorHandler";

interface UsePlanCardSaveProps {
  plan: Plan;
  metadata: Plan["metadata"];
  originalMetadata: Plan["metadata"];
  localMetadata: Plan["metadata"];
  setLocalMetadata: React.Dispatch<React.SetStateAction<Plan["metadata"]>>;
  updatePlanMutation: {
    mutateAsync: (params: { id: string; data: unknown }) => Promise<unknown>;
    isPending: boolean;
  };
  updateFeatureMutation: {
    mutateAsync: (params: {
      id: string;
      data: { status: "assigned" };
    }) => Promise<unknown>;
  };
  updateProductMutation: {
    mutateAsync: (params: {
      id: string;
      data: {
        components: Array<{
          id: string;
          name: string;
          type: string;
          componentTypeId?: string;
          currentVersion: string;
          previousVersion: string;
        }>;
        updatedAt: string;
        _partialUpdate: boolean;
      };
    }) => Promise<unknown>;
  };
  products: Array<{ id: string; components?: Array<{ id: string }> }>;
  allProductFeatures: Array<{ id: string }>;
  setErrorSnackbar: React.Dispatch<
    React.SetStateAction<{ open: boolean; message: string }>
  >;
}

export function usePlanCardSave({
  plan,
  metadata,
  originalMetadata,
  localMetadata,
  setLocalMetadata,
  updatePlanMutation,
  updateFeatureMutation,
  updateProductMutation,
  products,
  allProductFeatures: allProductFeaturesFromProps,
  setErrorSnackbar,
}: UsePlanCardSaveProps) {
  const queryClient = useQueryClient();

  // ⚡ OPTIMIZATION: Only fetch features when productId exists
  // Features are already loaded by PlanProductTab when user navigates to that tab
  // This ensures we have features when saving even if they weren't loaded yet
  const { data: allProductFeaturesFromQuery = [] } = useFeatures(
    originalMetadata?.productId
  );

  // Use features from props (cache) if available, otherwise from query
  // This prioritizes cached data but falls back to query if needed
  const allProductFeatures =
    allProductFeaturesFromProps.length > 0
      ? allProductFeaturesFromProps
      : allProductFeaturesFromQuery;

  const handleSaveTab = useCallback(
    async (tabIndex: number) => {
      try {
        const updateData = prepareTabData(tabIndex, metadata);

        // Debug: Log updateData for Setup tab
        if (tabIndex === 2) {
          console.log("[usePlanCardSave] Saving Setup tab to memory:", {
            tabIndex,
            updateData,
            calendarIds: updateData.calendarIds,
            indicatorIds: updateData.indicatorIds,
            teamIds: updateData.teamIds,
            teamIdsCount: updateData.teamIds?.length || 0,
            metadataTeamIds: metadata.teamIds,
            metadataTeamIdsCount: metadata.teamIds?.length || 0,
          });
        }

        // Validate components before saving to memory
        validateComponentsBeforeSave(
          tabIndex,
          updateData.components,
          metadata.productId,
          products,
          plan.metadata.components || []
        );

        // ⚡ NEW BEHAVIOR: Only save to memory (localMetadata), not to database
        // The main SAVE button will persist all changes atomically
        setLocalMetadata((prev) => {
          const merged = { ...prev, ...updateData };
          console.log("[usePlanCardSave] Saving tab to memory:", {
            tabIndex,
            updateData,
            prevTeamIds: prev.teamIds,
            mergedTeamIds: merged.teamIds,
            mergedTeamIdsCount: merged.teamIds?.length || 0,
          });
          return merged;
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Error saving tab ${tabIndex} to memory. Please try again.`;
        console.error("[handleSaveTab] Error saving tab to memory:", error);
        setErrorSnackbar({ open: true, message: errorMessage });
        throw error;
      }
    },
    [
      metadata,
      products,
      plan.metadata.components,
      setLocalMetadata,
      setErrorSnackbar,
    ]
  );

  /**
   * Helper: Detect if a phase ID is temporary (needs immediate persistence)
   * Temporary IDs are those that start with "phase-" and contain timestamp
   */
  const isTemporaryPhaseId = (phaseId: string | undefined): boolean => {
    if (!phaseId || typeof phaseId !== "string") {
      return false;
    }
    return phaseId.startsWith("phase-") && /phase-\d+/.test(phaseId);
  };

  /**
   * Helper: Persist new phases immediately to get real IDs (disconnected objects pattern)
   * This allows users to continue working (add references, reschedules, metrics) without blocking
   */
  const persistNewPhasesImmediately = useCallback(
    async (
      phases: Plan["metadata"]["phases"]
    ): Promise<Plan["metadata"]["phases"]> => {
      if (!phases || phases.length === 0) return phases;

      // Separate new phases (temporary IDs) from existing phases
      const newPhases = phases.filter((p) => isTemporaryPhaseId(p.id));
      const existingPhases = phases.filter((p) => !isTemporaryPhaseId(p.id));

      // If no new phases, return as-is (no persistence needed)
      if (newPhases.length === 0) {
        return phases;
      }

      console.log("[usePlanCardSave] Persisting new phases immediately:", {
        newPhasesCount: newPhases.length,
        existingPhasesCount: existingPhases.length,
        newPhaseIds: newPhases.map((p) => p.id),
      });

      try {
        // Persist only the new phases to get real IDs
        const validatedPhases = validatePhases(phases);
        validatePhaseData(validatedPhases);

        const updateDto = createPartialUpdateDto(
          plan,
          {
            phases: validatedPhases as typeof localMetadata.phases,
            milestones: localMetadata.milestones,
            // Include required fields from plan to ensure backend validation passes
            itOwner: localMetadata.itOwner ?? plan.metadata.itOwner,
            productId: localMetadata.productId ?? plan.metadata.productId,
          },
          plan.updatedAt
        );

        await updatePlanMutation.mutateAsync({
          id: plan.id,
          data: updateDto,
        });

        // Invalidate and refetch to get real IDs
        queryClient.invalidateQueries({
          queryKey: ["plans", "detail", plan.id],
          exact: true,
        });
        await queryClient.refetchQueries({
          queryKey: ["plans", "detail", plan.id],
          exact: true,
        });

        // After persistence, the phases should have real IDs from the server
        // For now, return the validated phases - they will be updated when the plan refetches
        // The localMetadata will sync from the refetched plan via usePlanCardState
        console.log("[usePlanCardSave] New phases persisted:", {
          originalNewPhaseIds: newPhases.map((p) => p.id),
          validatedPhaseIds: validatedPhases.map((p) => ({
            id: p.id,
            name: p.name,
          })),
        });

        return validatedPhases as typeof localMetadata.phases;
      } catch (error: unknown) {
        console.error(
          "[persistNewPhasesImmediately] Error persisting new phases:",
          error
        );
        // If persistence fails, still return phases so user can continue working
        // The main SAVE will retry later
        return phases;
      }
    },
    [plan, localMetadata.milestones, updatePlanMutation, queryClient]
  );

  const handleSaveTimeline = useCallback(
    async (phasesOverride?: Plan["metadata"]["phases"]) => {
      try {
        // Use phasesOverride if provided, otherwise use localMetadata to get the latest state
        // Ensure phasesToSave is always an array
        const phasesToSave = Array.isArray(phasesOverride)
          ? phasesOverride
          : Array.isArray(localMetadata.phases)
          ? localMetadata.phases
          : [];

        console.log("[usePlanCardSave] Saving timeline to memory:", {
          phaseCount: phasesToSave.length,
          phasesToSaveType: typeof phasesToSave,
          isArray: Array.isArray(phasesToSave),
          phasesOverrideType: typeof phasesOverride,
          phasesOverrideIsArray: Array.isArray(phasesOverride),
          localMetadataPhasesType: typeof localMetadata.phases,
          localMetadataPhasesIsArray: Array.isArray(localMetadata.phases),
          phases: phasesToSave.map((p) => ({
            id: p.id,
            name: p.name,
            isTemporary: isTemporaryPhaseId(p.id),
            startDate: p.startDate,
            endDate: p.endDate,
            hasMetricValues: !!p.metricValues,
          })),
        });

        const validatedPhases = validatePhases(phasesToSave);

        if (validatedPhases.length !== phasesToSave.length) {
          console.warn(
            `[PlanCard] Filtered out ${
              phasesToSave.length - validatedPhases.length
            } invalid phases`,
            {
              originalCount: phasesToSave.length,
              validatedCount: validatedPhases.length,
            }
          );
        }

        // Validate phase data
        validatePhaseData(validatedPhases);

        // ⚡ DISCONNECTED OBJECTS PATTERN:
        // 1. Persist new phases immediately to get real IDs (only if there are new phases)
        // 2. Save changes to existing phases only in memory (date changes, metricValues, etc.)
        // The main SAVE button will persist all changes atomically
        const phasesWithRealIds = await persistNewPhasesImmediately(
          validatedPhases as typeof localMetadata.phases
        );

        // Ensure phasesWithRealIds is always an array (fallback to validatedPhases)
        const finalPhases: Plan["metadata"]["phases"] =
          Array.isArray(phasesWithRealIds) && phasesWithRealIds.length > 0
            ? phasesWithRealIds
            : (validatedPhases as typeof localMetadata.phases);

        // Update localMetadata with phases (now with real IDs if they were new)
        // This saves all changes (dates, metrics, etc.) to memory only
        setLocalMetadata((prev) => ({
          ...prev,
          phases: finalPhases,
          milestones: localMetadata.milestones,
        }));

        console.log("[usePlanCardSave] Timeline saved to memory:", {
          phaseCount: finalPhases?.length || 0,
          newPhasesPersisted:
            finalPhases?.filter(
              (p) =>
                !isTemporaryPhaseId(p.id) &&
                phasesToSave.some(
                  (orig) => isTemporaryPhaseId(orig.id) && orig.name === p.name
                )
            ).length || 0,
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error saving timeline. Please try again.";
        console.error("[handleSaveTimeline] Error saving timeline:", error);
        setErrorSnackbar({ open: true, message: errorMessage });
        throw error;
      }
    },
    [
      localMetadata,
      setLocalMetadata,
      setErrorSnackbar,
      persistNewPhasesImmediately,
    ]
  );

  const handleSaveAll = useCallback(async () => {
    // Validate required fields before saving
    if (!localMetadata.name?.trim()) {
      throw new Error("El nombre del plan es obligatorio");
    }
    if (!localMetadata.status) {
      throw new Error("El estado es obligatorio");
    }
    if (!localMetadata.startDate) {
      throw new Error("La fecha de inicio es obligatoria");
    }
    if (!localMetadata.endDate) {
      throw new Error("La fecha de fin es obligatoria");
    }
    if (!localMetadata.productId) {
      throw new Error("El producto es obligatorio");
    }

    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      try {
        // ⚡ CRITICAL: Save plan atomically with all changes from localMetadata
        await updatePlanMutation.mutateAsync({
          id: plan.id,
          data: createFullUpdateDto(
            {
              ...plan,
              metadata: localMetadata,
            },
            plan.updatedAt
          ),
        });

        // ⚡ CRITICAL: After saving plan, handle post-save operations atomically
        // This includes updating feature statuses and component versions
        // We need to check what changed compared to originalMetadata
        const updateData = {
          featureIds: localMetadata.featureIds,
          components: localMetadata.components,
        };

        // Determine which tab had changes to execute appropriate post-save operations
        // Tab 1 (Product) handles features and components
        if (
          (updateData.featureIds || updateData.components) &&
          localMetadata.productId
        ) {
          await handlePostSaveOperations(
            1, // Product tab
            updateData,
            localMetadata,
            originalMetadata,
            allProductFeatures,
            products,
            updateFeatureMutation,
            updateProductMutation
          );
        }

        // ⚡ OPTIMIZATION: Invalidate queries after atomic save
        queryClient.invalidateQueries({ queryKey: ["plans"] });
        queryClient.invalidateQueries({ queryKey: ["features"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["teams"] });
        queryClient.invalidateQueries({
          queryKey: ["plans", "reschedules", plan.id],
        });

        // Invalidate phase reschedules for all phases
        if (localMetadata.phases && localMetadata.phases.length > 0) {
          localMetadata.phases.forEach((phase) => {
            if (phase.id) {
              queryClient.invalidateQueries({
                queryKey: ["plans", "reschedules", plan.id, "phases", phase.id],
              });
            }
          });
        }

        // ⚡ OPTIMIZATION: Only refetch the specific plan that was updated
        queryClient.invalidateQueries({
          queryKey: ["plans", "detail", plan.id],
          exact: true,
        });
        queryClient.invalidateQueries({ queryKey: ["plans", "list"] });
        await queryClient.refetchQueries({
          queryKey: ["plans", "detail", plan.id],
          exact: true,
        });

        // Refetch features if they were modified
        if (localMetadata.productId && updateData.featureIds) {
          await queryClient.refetchQueries({
            queryKey: ["features", "list", localMetadata.productId],
            exact: true,
          });
        }

        // Refetch products if components were modified
        if (localMetadata.productId && updateData.components) {
          await queryClient.refetchQueries({
            queryKey: ["products", "detail", localMetadata.productId],
            exact: true,
          });
        }

        // Update localMetadata to reflect saved state (triggers re-render)
        setLocalMetadata((prev) => ({ ...prev }));

        return;
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));

        categorizeError(error);

        const shouldContinue = await handleRetryLogic(
          error,
          retryCount,
          maxRetries,
          -2,
          queryClient
        );

        if (shouldContinue) {
          retryCount++;
          continue;
        }

        throw new Error(
          getErrorMessage(error, "Error saving. Please try again.")
        );
      }
    }

    throw lastError || new Error("Failed to save after multiple retries");
  }, [
    plan,
    localMetadata,
    originalMetadata,
    allProductFeatures,
    products,
    updatePlanMutation,
    updateFeatureMutation,
    updateProductMutation,
    queryClient,
    setLocalMetadata,
  ]);

  return {
    handleSaveTab,
    handleSaveTimeline,
    handleSaveAll,
  };
}
