import { Box, CircularProgress } from "@mui/material";

/**
 * Component for loading state
 */
export function PhasesMaintenanceLoadingState() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: 1400,
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
