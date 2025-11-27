import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type RoleMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function RoleMaintenanceErrorState({
  error,
}: RoleMaintenanceErrorStateProps) {
  return (
    <PageLayout title="Roles Maintenance" description="Manage roles and profiles">
      <Box p={3}>
        <Alert severity="error">
          Error loading roles:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

