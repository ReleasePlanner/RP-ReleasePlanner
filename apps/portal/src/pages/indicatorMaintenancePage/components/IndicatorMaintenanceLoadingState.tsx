import { Box, CircularProgress } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function IndicatorMaintenanceLoadingState() {
  return (
    <PageLayout title="Indicator Maintenance" description="Manage KPIs and indicators">
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

