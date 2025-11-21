import type { PlanComponent, Product } from "../../../../types";

export function validateComponentVersions(
  componentsToUpdate: PlanComponent[],
  product: Product,
  originalComponents: PlanComponent[]
): void {
  const originalComponentsMap = new Map(
    originalComponents.map((c) => [c.componentId, c.finalVersion])
  );

  for (const planComp of componentsToUpdate) {
    const productComponent = product.components?.find(
      (c) => c.id === planComp.componentId
    );
    if (!productComponent) {
      throw new Error(
        `Componente ${planComp.componentId} no encontrado en el producto`
      );
    }

    const planCurrentVersion =
      planComp.currentVersion ||
      productComponent.currentVersion ||
      "";
    const comparison = compareVersions(
      planComp.finalVersion,
      planCurrentVersion
    );

    if (comparison <= 0) {
      const componentName = productComponent.name || planComp.componentId;
      const previousVersion = originalComponentsMap.get(planComp.componentId);
      const errorMsg = previousVersion
        ? `La versión final del componente "${componentName}" (${planComp.finalVersion}) debe ser mayor que la versión actual (${planCurrentVersion}). Versión anterior en el plan: ${previousVersion}`
        : `La versión final del componente "${componentName}" (${planComp.finalVersion}) debe ser mayor que la versión actual (${planCurrentVersion})`;
      throw new Error(errorMsg);
    }
  }
}

function normalizeVersion(version: string): string {
  if (!version || version.trim().length === 0) return "0.0.0.0";
  const parts = version.trim().split(".").map((p) => Number.parseInt(p, 10) || 0);
  while (parts.length < 4) {
    parts.push(0);
  }
  return parts.slice(0, 4).join(".");
}

function compareVersions(v1: string, v2: string): number {
  const normalized1 = normalizeVersion(v1);
  const normalized2 = normalizeVersion(v2);
  const parts1 = normalized1.split(".").map((p) => Number.parseInt(p, 10));
  const parts2 = normalized2.split(".").map((p) => Number.parseInt(p, 10));

  for (let i = 0; i < 4; i++) {
    if (parts1[i] < parts2[i]) return -1;
    if (parts1[i] > parts2[i]) return 1;
  }
  return 0;
}

