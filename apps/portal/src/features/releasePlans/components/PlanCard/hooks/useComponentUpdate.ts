import type { PlanComponent, Product } from "../../../../types";

export function buildComponentUpdates(
  product: Product,
  componentsToUpdate: PlanComponent[]
): Array<{
  id: string;
  name: string;
  type: string;
  componentTypeId?: string;
  currentVersion: string;
  previousVersion: string;
}> {
  return (
    product.components?.map((productComponent) => {
      const planComp = componentsToUpdate.find(
        (c) => c.componentId === productComponent.id
      );

      const normalizedType = normalizeComponentType(productComponent.type);

      if (planComp) {
        const finalVersion = planComp.finalVersion?.trim() || "";
        const currentVersion =
          productComponent.currentVersion?.trim() || "0.0.0.0";

        if (!finalVersion) {
          throw new Error(
            `Component ${planComp.componentId} has invalid finalVersion`
          );
        }

        return {
          id: productComponent.id,
          name: productComponent.name,
          type: normalizedType || productComponent.type,
          componentTypeId: productComponent.componentTypeId,
          currentVersion: finalVersion,
          previousVersion: currentVersion || "0.0.0.0",
        };
      }

      return {
        id: productComponent.id,
        name: productComponent.name,
        type: normalizedType || productComponent.type,
        componentTypeId: productComponent.componentTypeId,
        currentVersion: productComponent.currentVersion || "",
        previousVersion:
          productComponent.previousVersion ||
          productComponent.currentVersion ||
          "0.0.0.0",
      };
    }) || []
  );
}

function normalizeComponentType(type?: string): string {
  if (!type) return "";
  let normalizedType = type.toLowerCase().trim();
  if (normalizedType === "service") {
    normalizedType = "services";
  }
  return normalizedType;
}

