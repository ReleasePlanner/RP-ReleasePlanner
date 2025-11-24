import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type IndicatorMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function IndicatorMaintenanceErrorState({
  error,
}: IndicatorMaintenanceErrorStateProps) {
  return (
    <PageLayout title="Indicator Maintenance" description="Manage KPIs and indicators">
      <Box p={3}>
        <Alert severity="error">
          Error loading indicators:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

