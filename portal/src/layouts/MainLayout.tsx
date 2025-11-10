import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
  Link,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleLeftSidebar, toggleRightSidebar } from "../store/store";
import HeaderMaterial from "./HeaderMaterial";

const drawerWidth = 260;

export function MainLayout({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const leftOpen = useAppSelector((s) => s.ui.leftSidebarOpen);
  const rightOpen = useAppSelector((s) => s.ui.rightSidebarOpen);
  const theme = useTheme();

  const year = useMemo(() => new Date().getFullYear(), []);

  const leftDrawer = (
    <Box role="navigation" sx={{ width: drawerWidth, height: "100%" }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Navigation
        </Typography>
        <Tooltip title="Hide sidebar" placement="right">
          <IconButton
            aria-label="Hide left sidebar"
            size="small"
            onClick={() => dispatch(toggleLeftSidebar())}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      {/* Navigation Links */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Link
          component={RouterLink}
          to="/release-planner"
          underline="none"
          sx={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(["color", "fontWeight"]),
            "&:hover": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          }}
        >
          Release Planner
        </Link>
        <Link
          component={RouterLink}
          to="/product-maintenance"
          underline="none"
          sx={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(["color", "fontWeight"]),
            "&:hover": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          }}
        >
          Products
        </Link>
      </Box>
    </Box>
  );

  const rightDrawer = (
    <Box role="complementary" sx={{ width: drawerWidth, height: "100%" }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Context
        </Typography>
        <Tooltip title="Hide sidebar" placement="right">
          <IconButton
            aria-label="Hide right sidebar"
            size="small"
            onClick={() => dispatch(toggleRightSidebar())}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      {/* Drawer Content */}
      <Box
        sx={{ p: 2, fontSize: "0.875rem", color: theme.palette.text.secondary }}
      >
        Useful links, activity, filters, or details.
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        height: "100vh",
      }}
    >
      <CssBaseline />
      <HeaderMaterial />

      {/* Left Sidebar */
      /* Temporary on mobile, persistent on md+ */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Temporary on mobile */}
        <Drawer
          variant="temporary"
          open={leftOpen}
          onClose={() => dispatch(toggleLeftSidebar())}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {leftDrawer}
        </Drawer>
        {/* Persistent on desktop */}
        <Drawer
          variant="persistent"
          open={leftOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {leftDrawer}
        </Drawer>
      </Box>

      {/* Main Content with Right Sidebar */}
      <Box
        component="main"
        sx={{
          ml: { md: leftOpen ? `${drawerWidth}px` : 0 },
          mr: { lg: rightOpen ? `${drawerWidth}px` : 0 },
          minHeight: 0,
          overflow: "auto",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          }}
        >
          {children ?? <Outlet />}
        </Container>
      </Box>

      {/* Right Sidebar */
      /* Temporary below lg, persistent on lg+ */}
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

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 1.5, md: 2 },
            px: { xs: 1.5, sm: 2, md: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "inherit" }}>
            © {year} Release Planner
          </Typography>
          <Link
            href="#top"
            underline="none"
            sx={{
              fontSize: "inherit",
              color: theme.palette.text.secondary,
              transition: theme.transitions.create(["color"]),
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            Back to top
          </Link>
        </Container>
      </Box>
    </Box>
  );
}
