import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type RescheduleTypeMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function RescheduleTypeMaintenanceErrorState({
  error,
}: RescheduleTypeMaintenanceErrorStateProps) {
  return (
    <PageLayout
      title="Reschedule Type Maintenance"
      description="Manage reschedule types for phase date changes"
    >
      <Box p={3}>
        <Alert severity="error">
          Error loading Reschedule Types:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

