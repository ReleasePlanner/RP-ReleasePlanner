import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function ITOwnerMaintenanceLoadingState() {
  return (
    <PageLayout
      title="IT Owner Maintenance"
      description="Manage IT Owners and their contact information"
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

