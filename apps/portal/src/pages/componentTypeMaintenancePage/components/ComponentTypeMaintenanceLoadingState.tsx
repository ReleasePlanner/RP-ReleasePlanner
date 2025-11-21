import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function ComponentTypeMaintenanceLoadingState() {
  return (
    <PageLayout
      title="Component Type Maintenance"
      description="Manage Component Types"
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

