import type { PlanComponent, Product } from "../../../../types";
import { validateComponentVersions } from "./useComponentValidation";

export function validateComponentsBeforeSave(
  tabIndex: number,
  components: PlanComponent[] | undefined,
  productId: string | undefined,
  products: Product[],
  planComponents: PlanComponent[]
): void {
  if (tabIndex !== 2 || !components || !productId) {
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Producto no encontrado: ${productId}`);
  }

  const componentsToUpdate = components.filter(
    (comp) => comp.finalVersion && comp.finalVersion.trim() !== ""
  );

  if (componentsToUpdate.length > 0) {
    validateComponentVersions(componentsToUpdate, product, planComponents);
  }
}

