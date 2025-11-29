import { Paper, Typography, useTheme, alpha } from "@mui/material";

export type RescheduleTypeMaintenanceEmptyStateProps = {
  readonly rescheduleTypesCount: number;
  readonly searchQuery: string;
};

/**
 * Component for empty state when no reschedule types are found
 */
export function RescheduleTypeMaintenanceEmptyState({
  rescheduleTypesCount,
  searchQuery,
}: RescheduleTypeMaintenanceEmptyStateProps) {
  const theme = useTheme();

  const getEmptyMessage = () => {
    if (rescheduleTypesCount === 0) {
      return "Start by adding your first reschedule type";
    }
    if (searchQuery) {
      return "Try adjusting your search criteria.";
    }
    return "No reschedule types match your filters.";
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
        {rescheduleTypesCount === 0 ? "No reschedule types configured" : "No reschedule types found"}
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

