/**
 * Left Sidebar Component
 *
 * Manages the responsive left sidebar drawer.
 * Temporary on mobile, persistent on desktop.
 */

import { Box, Drawer } from "@mui/material";
import { LeftDrawerContent, DRAWER_WIDTH } from "./LeftDrawerContent";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftSidebar } from "../../store/store";

/**
 * LeftSidebar Component
 *
 * Renders a responsive sidebar with:
 * - Temporary modal drawer on xs/sm (mobile)
 * - Persistent drawer on md+ (desktop)
 * - Navigation content from LeftDrawerContent
 * - Proper state management and animations
 *
 * @example
 * ```tsx
 * <LeftSidebar />
 * ```
 */
export function LeftSidebar() {
  const dispatch = useAppDispatch();
  const leftOpen = useAppSelector((s) => s.ui.leftSidebarOpen);

  const handleClose = () => dispatch(toggleLeftSidebar());

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Temporary drawer on mobile */}
      <Drawer
        variant="temporary"
        open={leftOpen}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <LeftDrawerContent onClose={handleClose} />
      </Drawer>

      {/* Persistent drawer on desktop */}
      <Drawer
        variant="persistent"
        open={leftOpen}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <LeftDrawerContent onClose={handleClose} />
      </Drawer>
    </Box>
  );
}
