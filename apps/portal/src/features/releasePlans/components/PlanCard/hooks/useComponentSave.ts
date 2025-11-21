import type { PlanComponent, Product } from "../../../../types";

export async function saveComponentUpdates(
  componentsToUpdate: PlanComponent[],
  product: Product,
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
  if (componentsToUpdate.length === 0) {
    return;
  }

  const componentUpdates = buildComponentUpdates(product, componentsToUpdate);

  await updateProductMutation.mutateAsync({
    id: product.id,
    data: {
      components: componentUpdates,
      updatedAt: product.updatedAt,
      _partialUpdate: true,
    },
  }).catch((error) => {
    console.error(`Error updating component versions:`, error);
    throw error;
  });
}

