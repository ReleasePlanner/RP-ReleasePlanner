import { Paper, Typography, useTheme, alpha } from "@mui/material";

export type PhasesMaintenanceEmptyStateProps = {
  readonly phasesCount: number;
  readonly searchQuery: string;
};

/**
 * Component for empty state when no phases are found
 */
export function PhasesMaintenanceEmptyState({
  phasesCount,
  searchQuery,
}: PhasesMaintenanceEmptyStateProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: "center",
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mb: 0.5,
        }}
      >
        {phasesCount === 0 ? "No phases configured" : "No phases found"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.75rem",
          color: theme.palette.text.disabled,
        }}
      >
        {phasesCount === 0
          ? "Start by adding your first base phase"
          : searchQuery
          ? "Try adjusting your search criteria."
          : "No phases match your filters."}
      </Typography>
    </Paper>
  );
}
