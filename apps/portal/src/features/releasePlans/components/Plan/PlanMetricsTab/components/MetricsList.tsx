import { memo } from "react";
import { Box, Paper, useTheme, alpha } from "@mui/material";
import type { Indicator } from "@/api/services/indicators.service";
import { MetricItem } from "./MetricItem";
import type { PlanMetricsStyles } from "../hooks/usePlanMetricsStyles";

export type MetricsListProps = {
  readonly metrics: Indicator[];
  readonly onDelete: (id: string) => void;
  readonly styles: PlanMetricsStyles;
};

export const MetricsList = memo(function MetricsList({
  metrics,
  onDelete,
  styles,
}: MetricsListProps) {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {metrics.map((metric, index) => (
          <MetricItem
            key={metric.id}
            metric={metric}
            isLast={index === metrics.length - 1}
            onDelete={onDelete}
            styles={styles}
          />
        ))}
      </Paper>
    </Box>
  );
});

