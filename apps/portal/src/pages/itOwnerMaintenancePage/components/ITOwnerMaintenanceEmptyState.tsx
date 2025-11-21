import { Paper, Typography, useTheme, alpha } from "@mui/material";

export type ITOwnerMaintenanceEmptyStateProps = {
  readonly ownersCount: number;
  readonly searchQuery: string;
};

/**
 * Component for empty state when no IT owners are found
 */
export function ITOwnerMaintenanceEmptyState({
  ownersCount,
  searchQuery,
}: ITOwnerMaintenanceEmptyStateProps) {
  const theme = useTheme();

  const getEmptyMessage = () => {
    if (ownersCount === 0) {
      return "Start by adding your first IT owner";
    }
    if (searchQuery) {
      return "Try adjusting your search criteria.";
    }
    return "No IT owners match your filters.";
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
        {ownersCount === 0 ? "No IT owners configured" : "No IT owners found"}
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

