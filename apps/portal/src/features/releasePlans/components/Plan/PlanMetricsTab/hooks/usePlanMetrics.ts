import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { Indicator } from "@/api/services/indicators.service";
import { indicatorsService } from "@/api/services/indicators.service";

export type PlanMetricsData = {
  planMetrics: Indicator[];
  isLoading: boolean;
  hasError: boolean;
};

export function usePlanMetrics(indicatorIds: string[]): PlanMetricsData {
  // Load indicators from API using the indicator IDs
  const indicatorQueries = useQueries({
    queries: indicatorIds.map((id) => ({
      queryKey: ["indicators", "detail", id],
      queryFn: () => indicatorsService.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Get indicators that are in the plan
  const planMetrics = useMemo(() => {
    return indicatorQueries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => query.data!);
  }, [indicatorQueries]);

  const isLoading = indicatorQueries.some((query) => query.isLoading);
  const hasError = indicatorQueries.some((query) => query.isError);

  return {
    planMetrics,
    isLoading,
    hasError,
  };
}

