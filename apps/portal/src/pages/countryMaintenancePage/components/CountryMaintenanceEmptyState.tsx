import { Paper, Typography, useTheme, alpha } from "@mui/material";

export type CountryMaintenanceEmptyStateProps = {
  readonly countriesCount: number;
  readonly searchQuery: string;
};

/**
 * Component for empty state when no countries are found
 */
export function CountryMaintenanceEmptyState({
  countriesCount,
  searchQuery,
}: CountryMaintenanceEmptyStateProps) {
  const theme = useTheme();

  const getEmptyMessage = () => {
    if (countriesCount === 0) {
      return "Start by adding your first country";
    }
    if (searchQuery) {
      return "Try adjusting your search criteria.";
    }
    return "No countries match your filters.";
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
        {countriesCount === 0 ? "No countries configured" : "No countries found"}
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

