import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function FeatureCategoryMaintenanceLoadingState() {
  return (
    <PageLayout
      title="Feature Category Maintenance"
      description="Manage Feature Categories"
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

