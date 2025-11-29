import { Box, Typography, Paper, Alert } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";

export type TalentMaintenanceErrorStateProps = {
  error: Error;
};

/**
 * Component for error state
 */
export function TalentMaintenanceErrorState({
  error,
}: TalentMaintenanceErrorStateProps) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <Paper sx={{ p: 3, maxWidth: 400 }}>
        <Alert severity="error" icon={<ErrorIcon />}>
          <Typography variant="h6">Error loading talents</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
      </Paper>
    </Box>
  );
}

