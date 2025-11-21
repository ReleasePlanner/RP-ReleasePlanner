import { memo } from "react";
import { Box, Typography } from "@mui/material";

export type ReleasePlannerResultsCountProps = {
  readonly filteredCount: number;
  readonly totalCount: number;
};

/**
 * Component for displaying results count
 */
export const ReleasePlannerResultsCount = memo(function ReleasePlannerResultsCount({
  filteredCount,
  totalCount,
}: ReleasePlannerResultsCountProps) {
  if (filteredCount === totalCount) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontSize: "0.6875rem",
        }}
      >
        Showing {filteredCount} of {totalCount} plans
      </Typography>
    </Box>
  );
});

