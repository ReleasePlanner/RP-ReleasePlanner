import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function ProductMaintenanceLoadingState() {
  return (
    <PageLayout
      title="Product Maintenance"
      description="Manage products and their component versions"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    </PageLayout>
  );
}

