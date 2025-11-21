import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type FeatureMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function FeatureMaintenanceErrorState({
  error,
}: FeatureMaintenanceErrorStateProps) {
  return (
    <PageLayout title="Feature Maintenance" description="Manage product features">
      <Box p={3}>
        <Alert severity="error">
          Error loading data:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

