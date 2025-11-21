import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type FeatureCategoryMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function FeatureCategoryMaintenanceErrorState({
  error,
}: FeatureCategoryMaintenanceErrorStateProps) {
  return (
    <PageLayout
      title="Feature Category Maintenance"
      description="Manage Feature Categories"
    >
      <Box p={3}>
        <Alert severity="error">
          Error loading feature categories:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

