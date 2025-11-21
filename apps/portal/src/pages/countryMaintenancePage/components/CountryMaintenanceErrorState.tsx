import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type CountryMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function CountryMaintenanceErrorState({
  error,
}: CountryMaintenanceErrorStateProps) {
  return (
    <PageLayout title="Country Maintenance" description="Manage countries and regions">
      <Box p={3}>
        <Alert severity="error">
          Error loading countries:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

