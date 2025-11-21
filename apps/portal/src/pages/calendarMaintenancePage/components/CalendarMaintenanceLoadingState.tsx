import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function CalendarMaintenanceLoadingState() {
  return (
    <PageLayout
      title="Calendar Management"
      description="Manage holidays and special days by country"
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

