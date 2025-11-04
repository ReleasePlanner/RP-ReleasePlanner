import {
  Box,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleRightSidebar } from "../store/store";

const drawerWidth = 260;

export function RightSidebar() {
  const dispatch = useAppDispatch();
  const rightOpen = useAppSelector((s) => s.ui.rightSidebarOpen);

  const rightDrawer = (
    <Box role="complementary" sx={{ width: drawerWidth }} className="h-full">
      <Box className="p-4 flex items-center justify-between">
        <span className="font-semibold text-primary-700">Context</span>
        <IconButton
          aria-label="Hide right sidebar"
          size="small"
          onClick={() => dispatch(toggleRightSidebar())}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <Box className="p-4 text-sm text-gray-600">
        Useful links, activity, filters, or details.
      </Box>
    </Box>
  );

  return (
    <Box
      component="aside"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
    >
      {/* Temporary on all but large */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={rightOpen}
        onClose={() => dispatch(toggleRightSidebar())}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", lg: "none" } }}
      >
        {rightDrawer}
      </Drawer>
      {/* Persistent on large screens */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={rightOpen}
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {rightDrawer}
      </Drawer>
    </Box>
  );
}