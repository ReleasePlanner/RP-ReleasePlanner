import { Paper, Typography, useTheme, alpha } from "@mui/material";

export type ProductMaintenanceEmptyStateProps = {
  readonly productsCount: number;
  readonly searchQuery: string;
};

/**
 * Component for empty state when no products are found
 */
export function ProductMaintenanceEmptyState({
  productsCount,
  searchQuery,
}: ProductMaintenanceEmptyStateProps) {
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
        {productsCount === 0 ? "No products configured" : "No products found"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.75rem",
          color: theme.palette.text.disabled,
        }}
      >
        {productsCount === 0
          ? "Start by adding your first product"
          : searchQuery
          ? "Try adjusting your search criteria."
          : "No products match your filters."}
      </Typography>
    </Paper>
  );
}

