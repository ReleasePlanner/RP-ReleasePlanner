import type { Feature } from "../../../../types";

export async function updateNewlyAddedFeatures(
  originalFeatureIds: string[],
  newFeatureIds: string[],
  allProductFeatures: Feature[],
  updateFeatureMutation: {
    mutateAsync: (params: {
      id: string;
      data: { status: "assigned" };
    }) => Promise<unknown>;
  }
): Promise<void> {
  const addedFeatureIds = newFeatureIds.filter(
    (id) => !originalFeatureIds.includes(id)
  );

  if (addedFeatureIds.length === 0) {
    return;
  }

  const featuresToUpdate = allProductFeatures.filter((f) =>
    addedFeatureIds.includes(f.id)
  );

  await Promise.all(
    featuresToUpdate.map((feature) =>
      updateFeatureMutation
        .mutateAsync({
          id: feature.id,
          data: {
            status: "assigned" as const,
          },
        })
        .catch((error) => {
          console.error(
            `Error updating feature ${feature.id} status to assigned:`,
            error
          );
          throw error;
        })
    )
  );
}

