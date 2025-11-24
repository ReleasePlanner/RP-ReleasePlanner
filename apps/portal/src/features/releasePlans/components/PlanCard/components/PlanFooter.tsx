import { Box, useTheme, alpha } from "@mui/material";

export type PlanFooterProps = {
  readonly children?: React.ReactNode;
};

/**
 * Footer component for PlanCard
 * Displays footer content at the bottom of the plan card
 */
export function PlanFooter({ children }: PlanFooterProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 1.25 },
        py: { xs: 0.5, sm: 0.75 },
        minHeight: 36,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        bgcolor: theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 1,
        position: "sticky",
        bottom: 0,
        zIndex: 2,
        transition: theme.transitions.create(
          ["background-color", "border-color"],
          {
            duration: theme.transitions.duration.short,
          }
        ),
      }}
    >
      {children}
    </Box>
  );
}

