import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function FeatureMaintenanceLoadingState() {
  return (
    <PageLayout title="Feature Maintenance" description="Manage product features">
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

