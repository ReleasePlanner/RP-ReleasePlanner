export type SafeTimelineValues = {
  readonly totalDays: number;
  readonly pxPerDay: number;
};

export function useSafeTimelineValues(
  totalDays: number,
  pxPerDay: number
): SafeTimelineValues {
  // Ensure we have safe numeric values to avoid NaN in styles when callers omit props
  const safeTotalDays =
    Number.isFinite(totalDays) && totalDays > 0 ? totalDays : 0;
  const safePxPerDay = Number.isFinite(pxPerDay) && pxPerDay > 0 ? pxPerDay : 1;

  return {
    totalDays: safeTotalDays,
    pxPerDay: safePxPerDay,
  };
}

