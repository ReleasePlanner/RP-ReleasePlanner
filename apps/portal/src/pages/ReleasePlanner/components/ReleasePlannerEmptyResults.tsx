import { Paper, Typography, useTheme, alpha } from "@mui/material";
import type { FilterStatus } from "../hooks/useReleasePlannerState";

export type ReleasePlannerEmptyResultsProps = {
  readonly plansCount: number;
  readonly searchQuery: string;
  readonly statusFilter: FilterStatus;
};

/**
 * Component for empty results when no plans match filters
 */
export function ReleasePlannerEmptyResults({
  plansCount,
  searchQuery,
  statusFilter,
}: ReleasePlannerEmptyResultsProps) {
  const theme = useTheme();

  const getMessage = () => {
    if (plansCount === 0) {
      return "Start by adding your first release plan";
    }
    if (searchQuery || statusFilter !== "all") {
      return "Try adjusting your search criteria or filters.";
    }
    return "No release plans match your filters.";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: "center",
        width: "100%",
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
        {plansCount === 0
          ? "No release plans configured"
          : "No release plans found"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.75rem",
          color: theme.palette.text.disabled,
        }}
      >
        {getMessage()}
      </Typography>
    </Paper>
  );
}

