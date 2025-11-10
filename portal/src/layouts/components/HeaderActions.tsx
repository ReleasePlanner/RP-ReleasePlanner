/**
 * Header Actions Component
 *
 * Manages the action buttons in the header (Add Release FAB/Button, Settings).
 */

import { Box, Fab, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Add as AddIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { toggleRightSidebar } from "../../store/store";
import { addPlan } from "../../features/releasePlans/slice";
import type { Plan } from "../../features/releasePlans/types";

/**
 * HeaderActions Component
 *
 * Renders header action buttons including:
 * - FAB button for creating release plans (sm+)
 * - Icon button for creating plans (mobile)
 * - Settings/right sidebar toggle button
 * - Proper responsiveness and theme integration
 *
 * @example
 * ```tsx
 * <HeaderActions />
 * ```
 */
export function HeaderActions() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleAddRelease = () => {
    const now = new Date();
    const year = now.getFullYear();
    const id = `plan-${Date.now()}`;
    const newPlan: Plan = {
      id,
      metadata: {
        id,
        name: "New Release",
        owner: "Unassigned",
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        status: "planned",
        description: "",
      },
      tasks: [],
    };
    dispatch(addPlan(newPlan));
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Add Release FAB - Hidden on mobile */}
      <Tooltip title="Create new release plan" placement="bottom">
        <Fab
          color="secondary"
          size="small"
          aria-label="Create new release plan"
          onClick={handleAddRelease}
          sx={{
            display: { xs: "none", sm: "flex" },
            minHeight: 40,
            height: 40,
            width: 40,
            boxShadow: theme.shadows[2],
            transition: theme.transitions.create(["transform", "box-shadow"], {
              duration: theme.transitions.duration.short,
            }),
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: theme.shadows[4],
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          <AddIcon sx={{ fontSize: 20 }} />
        </Fab>
      </Tooltip>

      {/* Add Release Button - Mobile Only */}
      <Tooltip title="Create new release plan" placement="bottom">
        <IconButton
          color="inherit"
          aria-label="Create new release plan"
          onClick={handleAddRelease}
          sx={{
            display: { xs: "flex", sm: "none" },
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
          <AddIcon />
        </IconButton>
      </Tooltip>

      {/* Settings/Right Panel Toggle */}
      <Tooltip title="Open settings panel" placement="bottom">
        <IconButton
          color="inherit"
          edge="end"
          aria-label="Open settings panel"
          onClick={() => dispatch(toggleRightSidebar())}
          sx={{
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
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
