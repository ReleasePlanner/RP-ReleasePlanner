/**
 * Header Navigation Menu Button
 *
 * Toggle button for opening/closing the left sidebar.
 */

import { IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { toggleLeftSidebar } from "../../store/store";

/**
 * HeaderNavButton Component
 *
 * Renders the hamburger menu button to toggle the left sidebar with:
 * - Tooltip on hover
 * - Proper theme colors and transitions
 * - Redux dispatch integration
 *
 * @example
 * ```tsx
 * <HeaderNavButton />
 * ```
 */
export function HeaderNavButton() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <Tooltip title="Open navigation menu" placement="bottom">
      <IconButton
        color="inherit"
        edge="start"
        aria-label="Open navigation menu"
        onClick={() => dispatch(toggleLeftSidebar())}
        sx={{
          mr: 2,
          transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.08),
          },
          "&:focus-visible": {
            backgroundColor: alpha(theme.palette.common.white, 0.12),
          },
        }}
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
}
