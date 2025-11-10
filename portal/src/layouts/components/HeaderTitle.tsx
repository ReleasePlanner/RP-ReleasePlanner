/**
 * Header Title Component
 *
 * Displays the application title in the header.
 */

import { Typography, useTheme } from "@mui/material";

/**
 * HeaderTitle Component
 *
 * Renders the main application title with:
 * - Responsive font sizing
 * - Proper typography hierarchy
 * - Theme color integration
 *
 * @example
 * ```tsx
 * <HeaderTitle />
 * ```
 */
export function HeaderTitle() {
  const theme = useTheme();

  return (
    <Typography
      variant="h6"
      component="h1"
      sx={{
        flexGrow: 1,
        fontWeight: 600,
        fontSize: { xs: "1.125rem", sm: "1.25rem" },
        lineHeight: 1.2,
        color: theme.palette.common.white,
        letterSpacing: "-0.01em",
      }}
    >
      Release Planner
    </Typography>
  );
}
