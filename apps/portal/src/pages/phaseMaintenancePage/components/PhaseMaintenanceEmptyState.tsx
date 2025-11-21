import { Box, useTheme } from "@mui/material";

/**
 * Component for empty state when no phases are found
 */
export function PhaseMaintenanceEmptyState() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        color: theme.palette.text.secondary,
        py: 8,
      }}
    >
      No phases registered.
    </Box>
  );
}

