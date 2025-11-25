import type { Plan, PlanComponent, PlanReference } from "../../../../types";

export function prepareTabData(
  tabIndex: number,
  metadata: Plan["metadata"]
): Partial<Plan["metadata"]> {
  const updateData: Partial<Plan["metadata"]> = {};

  switch (tabIndex) {
    case 0: // Datos Comunes
      validateCommonData(metadata);
      updateData.name = metadata.name;
      updateData.description = metadata.description;
      updateData.status = metadata.status;
      updateData.startDate = metadata.startDate;
      updateData.endDate = metadata.endDate;
      updateData.productId = metadata.productId;
      updateData.itOwner = metadata.itOwner;
      break;
    case 1: // Features
      updateData.featureIds = metadata.featureIds;
      break;
    case 2: // Componentes
      updateData.components = filterValidComponents(metadata.components || []);
      break;
    case 3: // Calendarios
      updateData.calendarIds = metadata.calendarIds;
      break;
    case 4: // Referencias
      updateData.references = metadata.references;
      updateData.milestones = extractMilestonesFromReferences(
        metadata.references || []
      );
      break;
    case 5: // Metrics
      updateData.indicatorIds = metadata.indicatorIds;
      break;
  }

  return updateData;
}

function validateCommonData(metadata: Plan["metadata"]): void {
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
}

function filterValidComponents(
  components: PlanComponent[]
): PlanComponent[] {
  return components.filter(
    (comp) =>
      comp?.componentId &&
      comp?.currentVersion &&
      comp?.finalVersion &&
      comp.finalVersion.trim() !== ""
  );
}

function extractMilestonesFromReferences(
  references: PlanReference[]
): Plan["metadata"]["milestones"] {
  const milestoneRefs = references.filter(
    (ref) => ref.type === "milestone" && ref.date
  );

  if (milestoneRefs.length === 0) {
    return [];
  }

  return milestoneRefs
    .map((ref) => {
      if (!ref.date) {
        return null;
      }
      return {
        id:
          ref.id ||
          `milestone-${ref.phaseId || ""}-${ref.date}-${Date.now()}`,
        date: ref.date,
        name: ref.title,
        description: ref.description,
      };
    })
    .filter((m): m is NonNullable<typeof m> => m !== null);
}

