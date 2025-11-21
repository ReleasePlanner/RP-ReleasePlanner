import { memo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Timeline as PhasesIcon } from "@mui/icons-material";

/**
 * Component for the page header
 */
export const PhasesMaintenanceHeader = memo(function PhasesMaintenanceHeader() {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <PhasesIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
      <Typography variant="h4" component="h1">
        Base Phases Maintenance
      </Typography>
    </Box>
  );
});

