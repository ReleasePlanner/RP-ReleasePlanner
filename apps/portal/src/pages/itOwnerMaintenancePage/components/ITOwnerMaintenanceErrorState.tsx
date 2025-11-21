import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type ITOwnerMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function ITOwnerMaintenanceErrorState({
  error,
}: ITOwnerMaintenanceErrorStateProps) {
  return (
    <PageLayout
      title="IT Owner Maintenance"
      description="Manage IT Owners and their contact information"
    >
      <Box p={3}>
        <Alert severity="error">
          Error loading IT Owners:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

