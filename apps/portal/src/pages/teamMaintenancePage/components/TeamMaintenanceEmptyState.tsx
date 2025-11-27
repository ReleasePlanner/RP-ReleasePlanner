import { Paper, Typography, useTheme, alpha } from "@mui/material";

export type TeamMaintenanceEmptyStateProps = {
  readonly teamsCount: number;
  readonly searchQuery: string;
};

/**
 * Component for empty state when no teams are found
 */
export function TeamMaintenanceEmptyState({
  teamsCount,
  searchQuery,
}: TeamMaintenanceEmptyStateProps) {
  const theme = useTheme();

  const getEmptyMessage = () => {
    if (teamsCount === 0) {
      return "Start by adding your first team";
    }
    if (searchQuery) {
      return "Try adjusting your search criteria.";
    }
    return "No teams match your filters.";
  };

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
        {teamsCount === 0 ? "No teams configured" : "No teams found"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.75rem",
          color: theme.palette.text.disabled,
        }}
      >
        {getEmptyMessage()}
      </Typography>
    </Paper>
  );
}

