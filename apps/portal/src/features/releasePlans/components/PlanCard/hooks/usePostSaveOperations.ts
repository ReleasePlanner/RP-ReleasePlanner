import type { PlanComponent } from "../../../../types";
import { updateNewlyAddedFeatures } from "./useFeatureUpdate";
import { saveComponentUpdates } from "./useComponentSave";

export async function handlePostSaveOperations(
  tabIndex: number,
  updateData: Partial<{
    featureIds?: string[];
    components?: PlanComponent[];
  }>,
  metadata: {
    productId?: string;
    featureIds?: string[];
  },
  originalMetadata: {
    featureIds?: string[];
  },
  allProductFeatures: Array<{ id: string }>,
  products: Array<{ id: string; components?: Array<{ id: string }> }>,
  updateFeatureMutation: {
    mutateAsync: (params: {
      id: string;
      data: { status: "assigned" };
    }) => Promise<unknown>;
  },
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
  }
): Promise<void> {
  // If saving Product tab (tab 1), handle both Features and Components
  if (tabIndex === 1) {
    // Update feature statuses to "assigned" if features changed
    if (updateData.featureIds) {
      await updateNewlyAddedFeatures(
        originalMetadata.featureIds || [],
        updateData.featureIds,
        allProductFeatures,
        updateFeatureMutation
      );
    }

    // Update component versions atomically and transactionally AFTER plan is saved
    if (updateData.components && metadata.productId) {
      const product = products.find((p) => p.id === metadata.productId);
      if (product) {
        const componentsToUpdate =
          updateData.components.filter(
            (comp) => comp.finalVersion && comp.finalVersion.trim() !== ""
          ) || [];

        if (componentsToUpdate.length > 0) {
          await saveComponentUpdates(
            componentsToUpdate,
            product as Parameters<typeof saveComponentUpdates>[1],
            updateProductMutation
          );
        }
      }
    }
  }
}
