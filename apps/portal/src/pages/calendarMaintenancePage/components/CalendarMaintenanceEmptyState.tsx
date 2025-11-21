import { Paper, Typography, useTheme, alpha } from "@mui/material";
import { CalendarMonth as CalendarIcon } from "@mui/icons-material";

/**
 * Component for empty state when no country is selected
 */
export function CalendarMaintenanceEmptyState() {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        p: 6,
        textAlign: "center",
      }}
    >
      <CalendarIcon
        sx={{
          fontSize: 40,
          color: theme.palette.text.secondary,
          mb: 1.5,
          opacity: 0.5,
        }}
      />
      <Typography
        variant="body1"
        sx={{
          mb: 0.5,
          fontWeight: 500,
          fontSize: "0.875rem",
          color: theme.palette.text.secondary,
        }}
      >
        Select a Country
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.75rem",
          color: theme.palette.text.disabled,
        }}
      >
        Choose a country from the sidebar to view and manage its holidays and
        special days
      </Typography>
    </Paper>
  );
}

