import { Box, Alert } from "@mui/material";

export type PhasesMaintenanceErrorStateProps = {
  readonly error: Error | null;
};

/**
 * Component for error state
 */
export function PhasesMaintenanceErrorState({
  error,
}: PhasesMaintenanceErrorStateProps) {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto" }}>
      <Alert severity="error">
        Error loading phases:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </Alert>
    </Box>
  );
}
