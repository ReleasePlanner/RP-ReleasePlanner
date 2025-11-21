import { Paper, Typography, useTheme, alpha } from "@mui/material";

export type FeatureCategoryMaintenanceEmptyStateProps = {
  readonly categoriesCount: number;
  readonly searchQuery: string;
};

/**
 * Component for empty state when no feature categories are found
 */
export function FeatureCategoryMaintenanceEmptyState({
  categoriesCount,
  searchQuery,
}: FeatureCategoryMaintenanceEmptyStateProps) {
  const theme = useTheme();

  const getEmptyMessage = () => {
    if (categoriesCount === 0) {
      return "Start by adding your first feature category";
    }
    if (searchQuery) {
      return "Try adjusting your search criteria.";
    }
    return "No feature categories match your filters.";
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
        {categoriesCount === 0
          ? "No feature categories configured"
          : "No feature categories found"}
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

