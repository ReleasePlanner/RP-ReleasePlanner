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

            await queryClient.refetchQueries({ queryKey: ["plans"] });
            await queryClient.refetchQueries({ queryKey: ["features"] });
            await queryClient.refetchQueries({ queryKey: ["products"] });

            setLocalMetadata((prev) => {
              const merged = { ...prev, ...updateData };
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

  const handleSaveTimeline = useCallback(async () => {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      try {
        const phasesToSave = metadata.phases || [];
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

        const updateDto = createPartialUpdateDto(
          plan,
          {
            phases: validatedPhases as typeof metadata.phases,
            milestones: metadata.milestones,
          },
          plan.updatedAt
        );

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
          phases: metadata.phases,
          milestones: metadata.milestones,
        }));

        return;
      } catch (error: unknown) {
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
  }, [plan, metadata, updatePlanMutation, queryClient, setLocalMetadata]);

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

