import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type TeamMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function TeamMaintenanceErrorState({
  error,
}: TeamMaintenanceErrorStateProps) {
  return (
    <PageLayout title="Teams Maintenance" description="Manage teams and talents">
      <Box p={3}>
        <Alert severity="error">
          Error loading teams:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

