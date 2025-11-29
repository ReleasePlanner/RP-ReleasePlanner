import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function RescheduleTypeMaintenanceLoadingState() {
  return (
    <PageLayout
      title="Reschedule Type Maintenance"
      description="Manage reschedule types for phase date changes"
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

