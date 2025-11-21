import { useMemo } from "react";
import type { PlanReference } from "../../../../../../types";

export type DayReferenceData = {
  readonly commentsCount: number;
  readonly filesCount: number;
  readonly linksCount: number;
  readonly hasData: boolean;
  readonly isDayMilestone: boolean;
  readonly dayRefs: PlanReference[];
};

export function useDayReferences(
  references: PlanReference[],
  dateKey: string
): DayReferenceData {
  return useMemo(() => {
    // Find day-level references (period-level or day-level without phaseId)
    const dayRefs = references.filter(
      (ref) =>
        (ref.date === dateKey || ref.periodDay === dateKey) &&
        !ref.phaseId // Day-level references without phase
    );

    const commentsCount = dayRefs.filter(
      (r) => r.type === "note" && !r.url
    ).length;
    const filesCount = dayRefs.filter(
      (r) => r.type === "document" && r.files && r.files.length > 0
    ).length;
    const linksCount = dayRefs.filter(
      (r) => r.type === "link" || (r.type === "document" && r.url)
    ).length;
    const hasData = commentsCount > 0 || filesCount > 0 || linksCount > 0;
    const isDayMilestone = dayRefs.some((r) => r.type === "milestone");

    return {
      commentsCount,
      filesCount,
      linksCount,
      hasData,
      isDayMilestone,
      dayRefs,
    };
  }, [references, dateKey]);
}

