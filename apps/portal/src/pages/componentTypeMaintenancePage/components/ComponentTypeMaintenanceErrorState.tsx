import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type ComponentTypeMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function ComponentTypeMaintenanceErrorState({
  error,
}: ComponentTypeMaintenanceErrorStateProps) {
  return (
    <PageLayout
      title="Component Type Maintenance"
      description="Manage Component Types"
    >
      <Box p={3}>
        <Alert severity="error">
          Error loading component types:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

