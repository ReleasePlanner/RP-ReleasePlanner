import type { PlanPhase } from "../../../../types";

export function validatePhases(phases: PlanPhase[]): PlanPhase[] {
  return phases
    .filter((p) => {
      if (!p.name || !p.startDate || !p.endDate) {
        console.warn(
          `[PlanCard] Skipping invalid phase ${p.id}: missing required fields`,
          {
            phaseId: p.id,
            hasName: !!p.name,
            hasStartDate: !!p.startDate,
            hasEndDate: !!p.endDate,
            phase: p,
          }
        );
        return false;
      }
      if (p.startDate >= p.endDate) {
        console.warn(
          `[PlanCard] Skipping invalid phase ${p.id}: endDate before or equal to startDate`,
          {
            phaseId: p.id,
            phaseName: p.name,
            startDate: p.startDate,
            endDate: p.endDate,
          }
        );
        return false;
      }
      return true;
    })
    .map((p) => ({
      name: p.name?.trim() || "",
      startDate: p.startDate || "",
      endDate: p.endDate || "",
      color: p.color || "#185ABD",
      metricValues: p.metricValues || {},
    }));
}

export function validatePhaseData(phases: PlanPhase[]): void {
  const invalidPhases = phases.filter(
    (p) => !p.name?.trim() || !p.startDate?.trim() || !p.endDate?.trim()
  );
  if (invalidPhases.length > 0) {
    throw new Error(
      `Cannot save plan: ${invalidPhases.length} phase(s) are missing required fields (name, startDate, or endDate)`
    );
  }

  const invalidDateFormats = phases.filter((p) => {
    try {
      if (p.startDate) new Date(p.startDate);
      if (p.endDate) new Date(p.endDate);
      return false;
    } catch {
      return true;
    }
  });
  if (invalidDateFormats.length > 0) {
    throw new Error(
      `Cannot save plan: ${invalidDateFormats.length} phase(s) have invalid date formats`
    );
  }
}

