import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { createFullUpdateDto, createPartialUpdateDto } from "../../../lib/planConverters";
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
    mutateAsync: (params: { id: string; data: { status: "assigned" } }) => Promise<unknown>;
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
  allProductFeatures,
  setErrorSnackbar,
}: UsePlanCardSaveProps) {
  const queryClient = useQueryClient();

  const handleSaveTab = useCallback(
    async (tabIndex: number) => {
      try {
        const updateData = prepareTabData(tabIndex, metadata);

        // Debug: Log updateData for Setup tab
        if (tabIndex === 2) {
          console.log('[usePlanCardSave] Saving Setup tab:', {
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

        const maxRetries = 3;
        let retryCount = 0;
        let lastError: Error | null = null;

        while (retryCount < maxRetries) {
          try {
            validateComponentsBeforeSave(
              tabIndex,
              updateData.components,
              metadata.productId,
              products,
              plan.metadata.components || []
            );

            const updateDto = createPartialUpdateDto(
              plan,
              updateData,
              plan.updatedAt
            );

            // Debug: Log updateDto for Setup tab
            if (tabIndex === 2) {
              console.log('[usePlanCardSave] Update DTO for Setup tab:', {
                calendarIds: updateDto.calendarIds,
                indicatorIds: updateDto.indicatorIds,
                teamIds: updateDto.teamIds,
                teamIdsCount: updateDto.teamIds?.length || 0,
                updateDtoKeys: Object.keys(updateDto),
                fullUpdateDto: updateDto,
              });
            }

            await updatePlanMutation.mutateAsync({
              id: plan.id,
              data: updateDto,
            });

            await handlePostSaveOperations(
              tabIndex,
              updateData,
              metadata,
              originalMetadata,
              allProductFeatures,
              products,
              updateFeatureMutation,
              updateProductMutation
            );

            await queryClient.invalidateQueries({ queryKey: ["plans"] });
            await queryClient.invalidateQueries({ queryKey: ["features"] });
            await queryClient.invalidateQueries({ queryKey: ["products"] });
            
                   // Invalidate teams cache when saving Setup tab (tab 2)
                   // This will invalidate all team queries including ["teams", "detail", id]
                   if (tabIndex === 2) {
                     // Invalidate all team-related queries
                     await queryClient.invalidateQueries({ queryKey: ["teams"] });
                   }

            // Wait for refetch to complete before updating local metadata
            await queryClient.refetchQueries({ queryKey: ["plans"] });
            await queryClient.refetchQueries({ queryKey: ["features"] });
            await queryClient.refetchQueries({ queryKey: ["products"] });
            
            // Refetch teams when saving Setup tab (tab 2)
            if (tabIndex === 2) {
              // Refetch all team queries to ensure new teams are loaded
              await queryClient.refetchQueries({ queryKey: ["teams"] });
              
              // Debug: Log after refetch to verify plan was updated
              console.log('[usePlanCardSave] After refetch for Setup tab:', {
                planId: plan.id,
                updateDataTeamIds: updateData.teamIds,
                updateDataTeamIdsCount: updateData.teamIds?.length || 0,
              });
            }

            // Temporarily update localMetadata with updateData to show changes immediately
            // The useEffect in usePlanCardState will sync from originalMetadata when plan prop updates
            setLocalMetadata((prev) => {
              const merged = { ...prev, ...updateData };
              console.log('[usePlanCardSave] Updating localMetadata:', {
                tabIndex,
                updateData,
                prevTeamIds: prev.teamIds,
                mergedTeamIds: merged.teamIds,
                mergedTeamIdsCount: merged.teamIds?.length || 0,
              });
              return merged;
            });

            return;
          } catch (error: unknown) {
            lastError =
              error instanceof Error ? error : new Error(String(error));

            categorizeError(error);

            const shouldContinue = await handleRetryLogic(
              error,
              retryCount,
              maxRetries,
              tabIndex,
              queryClient
            );

            if (shouldContinue) {
              retryCount++;
              continue;
            }

            throw new Error(
              getErrorMessage(
                error,
                `Error saving tab ${tabIndex}. Please try again.`
              )
            );
          }
        }

        throw (
          lastError ||
          new Error(`Failed to save tab ${tabIndex} after multiple retries`)
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Error saving tab ${tabIndex}. Please try again.`;
        console.error("[handleSaveTab] Error saving tab:", error);
        setErrorSnackbar({ open: true, message: errorMessage });
        throw error;
      }
    },
    [
      plan,
      metadata,
      originalMetadata,
      products,
      allProductFeatures,
      updatePlanMutation,
      updateFeatureMutation,
      updateProductMutation,
      queryClient,
      setLocalMetadata,
      setErrorSnackbar,
    ]
  );

  const handleSaveTimeline = useCallback(async (phasesOverride?: Plan["metadata"]["phases"]) => {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      let updateDto: any = null;
      try {
        // Use phasesOverride if provided, otherwise use localMetadata to get the latest state including metricValues
        // Ensure phasesToSave is always an array
        const phasesToSave = Array.isArray(phasesOverride) 
          ? phasesOverride 
          : (Array.isArray(localMetadata.phases) ? localMetadata.phases : []);
        
        console.log("[usePlanCardSave] Saving timeline with phases:", {
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
            hasMetricValues: !!p.metricValues,
            metricValues: p.metricValues,
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

        updateDto = createPartialUpdateDto(
          plan,
          {
            phases: validatedPhases as typeof localMetadata.phases,
            milestones: localMetadata.milestones,
          },
          plan.updatedAt
        );

        console.log("[usePlanCardSave] Update DTO phases:", {
          phaseCount: updateDto.phases?.length || 0,
          phases: updateDto.phases?.map((p: any) => ({
            name: p.name,
            hasMetricValues: !!p.metricValues,
            metricValues: p.metricValues,
          })),
        });

        if (updateDto.phases) {
          validatePhaseData(updateDto.phases);
        }

        await updatePlanMutation.mutateAsync({
          id: plan.id,
          data: updateDto,
        });

        await queryClient.invalidateQueries({ queryKey: ["plans"] });
        await queryClient.refetchQueries({ queryKey: ["plans"] });

        setLocalMetadata((prev) => ({
          ...prev,
          phases: localMetadata.phases,
          milestones: localMetadata.milestones,
        }));

        return;
      } catch (error: unknown) {
        // Log detailed error information for debugging
        const errorResponseData = (error as any)?.responseData || (error as any)?.response?.data || (error as any)?.data;
        console.error("[usePlanCardSave] Error saving timeline:", {
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorResponseData,
          validationErrors: errorResponseData?.errors,
          validationDetails: errorResponseData?.details,
          updateDto: updateDto ? {
            hasPhases: !!updateDto.phases,
            phaseCount: updateDto.phases?.length || 0,
            phases: updateDto.phases?.map((p: any) => ({
              name: p.name,
              startDate: p.startDate,
              endDate: p.endDate,
              color: p.color,
              hasMetricValues: !!p.metricValues,
              metricValues: p.metricValues,
              metricValuesType: typeof p.metricValues,
              metricValuesKeys: p.metricValues ? Object.keys(p.metricValues) : [],
            })),
          } : null,
        });
        
        lastError = error instanceof Error ? error : new Error(String(error));

        const shouldContinue = await handleRetryLogic(
          error,
          retryCount,
          maxRetries,
          -1,
          queryClient
        );

        if (shouldContinue) {
          retryCount++;
          continue;
        }

        throw new Error(
          getErrorMessage(error, "Error saving timeline. Please try again.")
        );
      }
    }

    throw (
      lastError || new Error("Failed to save timeline after multiple retries")
    );
  }, [plan, localMetadata, updatePlanMutation, queryClient, setLocalMetadata]);

  const handleSaveAll = useCallback(async () => {
    // Validate required fields before saving
    if (!metadata.name?.trim()) {
      throw new Error("El nombre del plan es obligatorio");
    }
    if (!metadata.status) {
      throw new Error("El estado es obligatorio");
    }
    if (!metadata.startDate) {
      throw new Error("La fecha de inicio es obligatoria");
    }
    if (!metadata.endDate) {
      throw new Error("La fecha de fin es obligatoria");
    }
    if (!metadata.productId) {
      throw new Error("El producto es obligatorio");
    }

    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      try {
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

        await queryClient.invalidateQueries({ queryKey: ["plans"] });
        await queryClient.refetchQueries({ queryKey: ["plans"] });

        setLocalMetadata((prev) => ({ ...prev }));

        return;
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));

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
    metadata,
    updatePlanMutation,
    queryClient,
    setLocalMetadata,
  ]);

  return {
    handleSaveTab,
    handleSaveTimeline,
    handleSaveAll,
  };
}

