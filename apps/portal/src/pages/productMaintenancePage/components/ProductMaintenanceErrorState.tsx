import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type ProductMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function ProductMaintenanceErrorState({
  error,
}: ProductMaintenanceErrorStateProps) {
  return (
    <PageLayout
      title="Product Maintenance"
      description="Manage products and their component versions"
    >
      <Box p={3}>
        <Alert severity="error">
          Error loading products:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

