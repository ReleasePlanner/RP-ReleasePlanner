import { Box, Alert } from "@mui/material";
import { PageLayout } from "@/components";

export type CalendarMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function CalendarMaintenanceErrorState({
  error,
}: CalendarMaintenanceErrorStateProps) {
  return (
    <PageLayout
      title="Calendar Management"
      description="Manage holidays and special days by country"
    >
      <Box p={3}>
        <Alert severity="error">
          Error loading calendars:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    </PageLayout>
  );
}

