import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";
import { PersonOutline as PersonIcon } from "@mui/icons-material";

export type TalentMaintenanceEmptyStateProps = {
  talentsCount: number;
  searchQuery: string;
};

/**
 * Component for empty state
 */
export function TalentMaintenanceEmptyState({
  talentsCount,
  searchQuery,
}: TalentMaintenanceEmptyStateProps) {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: "none",
        }}
      >
        <PersonIcon
          sx={{
            fontSize: 64,
            color: theme.palette.text.disabled,
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontSize: "1rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          {talentsCount === 0
            ? "No talents yet"
            : `No talents matching "${searchQuery}"`}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.75rem",
          }}
        >
          {talentsCount === 0
            ? "Add your first talent to get started"
            : "Try adjusting your search query"}
        </Typography>
      </Paper>
    </Box>
  );
}

