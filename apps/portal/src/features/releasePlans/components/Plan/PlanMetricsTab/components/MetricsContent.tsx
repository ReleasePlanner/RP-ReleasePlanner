import { memo } from "react";
import type { Indicator } from "@/api/services/indicators.service";
import { MetricsLoadingState } from "./MetricsLoadingState";
import { MetricsErrorState } from "./MetricsErrorState";
import { MetricsEmptyState } from "./MetricsEmptyState";
import { MetricsList } from "./MetricsList";
import type { PlanMetricsStyles } from "../hooks/usePlanMetricsStyles";

export type MetricsContentProps = {
  readonly isLoading: boolean;
  readonly hasError: boolean;
  readonly metrics: Indicator[];
  readonly onDelete: (id: string) => void;
  readonly styles: PlanMetricsStyles;
};

export const MetricsContent = memo(function MetricsContent({
  isLoading,
  hasError,
  metrics,
  onDelete,
  styles,
}: MetricsContentProps) {
  if (isLoading) {
    return <MetricsLoadingState />;
  }

  if (hasError) {
    return <MetricsErrorState />;
  }

  if (metrics.length === 0) {
    return <MetricsEmptyState />;
  }

  return <MetricsList metrics={metrics} onDelete={onDelete} styles={styles} />;
});

