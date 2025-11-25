import { useState, useCallback } from "react";
import { Box, Stack } from "@mui/material";
import { SelectIndicatorsDialog } from "./SelectIndicatorsDialog";
import { MetricsHeader, MetricsContent } from "./components";
import { usePlanMetrics, usePlanMetricsStyles } from "./hooks";

export type PlanMetricsTabProps = {
  readonly indicatorIds?: string[];
  readonly onIndicatorIdsChange?: (indicatorIds: string[]) => void;
};

export function PlanMetricsTab({
  indicatorIds = [],
  onIndicatorIdsChange,
}: PlanMetricsTabProps) {
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const { planMetrics, isLoading, hasError } = usePlanMetrics(indicatorIds);
  const styles = usePlanMetricsStyles();

  const handleAddIndicators = useCallback(
    (newIndicatorIds: string[]) => {
      if (onIndicatorIdsChange) {
        // Filter out duplicates - only add indicators that aren't already in the plan
        const uniqueNewIds = newIndicatorIds.filter(
          (id) => !indicatorIds.includes(id)
        );
        if (uniqueNewIds.length > 0) {
          onIndicatorIdsChange([...indicatorIds, ...uniqueNewIds]);
        }
      }
      setSelectDialogOpen(false);
    },
    [indicatorIds, onIndicatorIdsChange]
  );

  const handleDeleteIndicator = useCallback(
    (indicatorId: string) => {
      if (onIndicatorIdsChange) {
        onIndicatorIdsChange(indicatorIds.filter((id) => id !== indicatorId));
      }
    },
    [indicatorIds, onIndicatorIdsChange]
  );

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={1}
        sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <MetricsHeader
          metricCount={planMetrics.length}
          onAddClick={() => setSelectDialogOpen(true)}
          styles={styles}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MetricsContent
            isLoading={isLoading}
            hasError={hasError}
            metrics={planMetrics}
            onDelete={handleDeleteIndicator}
            styles={styles}
          />
        </Box>
      </Stack>

      <SelectIndicatorsDialog
        open={selectDialogOpen}
        selectedIndicatorIds={indicatorIds}
        onClose={() => setSelectDialogOpen(false)}
        onAddIndicators={handleAddIndicators}
      />
    </Box>
  );
}

