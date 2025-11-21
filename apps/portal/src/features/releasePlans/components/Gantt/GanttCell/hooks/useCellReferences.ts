import { useMemo } from "react";
import type { PlanReference } from "../../../../types";

export type CellRefsByType = {
  readonly comments: PlanReference[];
  readonly files: PlanReference[];
  readonly links: PlanReference[];
};

export function useCellReferences(
  cellReferences: PlanReference[],
  phaseId: string,
  date: string
): CellRefsByType {
  return useMemo(() => {
    const refs = cellReferences.filter(
      (ref) =>
        ref.phaseId === phaseId &&
        (ref.date === date || ref.calendarDayId) // Match by date or calendarDayId
    );

    return {
      comments: refs.filter(
        (r) => r.type === "note" && !r.url
      ), // Notes without URL are comments
      files: refs.filter(
        (r) => r.type === "document" && r.files && r.files.length > 0
      ),
      links: refs.filter(
        (r) => r.type === "link" || (r.type === "document" && r.url)
      ),
    };
  }, [cellReferences, phaseId, date]);
}

