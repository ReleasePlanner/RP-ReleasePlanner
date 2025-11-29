/**
 * Left Drawer Navigation Content
 *
 * Displays the navigation menu with links to main sections.
 * Features:
 * - Minimalist, elegant design with icons
 * - Active route indicator
 * - Smooth transitions and micro-interactions
 * - Material UI 7 compliant
 * - Full accessibility support
 */

import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Typography,
  useTheme,
  alpha,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Extension as FeaturesIcon,
  CalendarMonth as CalendarsIcon,
  Person as PersonIcon,
  Timeline as PhasesIcon,
  Category as ComponentTypeIcon,
  Label as FeatureCategoryIcon,
  Public as CountryIcon,
  Assessment as IndicatorsIcon,
  Groups as TeamsIcon,
  Badge as RolesIcon,
  People as TalentsIcon,
  Schedule as RescheduleTypeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { toggleLeftSidebar } from "../../store/store";

export const DRAWER_WIDTH = 280;

/**
 * Navigation text constants
 */
export const NAVIGATION_LABELS = {
  TITLE: "Navigation",
  CLOSE: "Close navigation",
  RELEASE_PLANNER: "Release Planner",
  PHASES: "Phases",
  PRODUCTS: "Products",
  FEATURES: "Features",
  CALENDARS: "Calendars",
  IT_OWNERS: "Owners",
  COMPONENT_TYPES: "Component Types",
  FEATURE_CATEGORIES: "Feature Categories",
  COUNTRIES: "Countries",
  INDICATORS: "Indicators",
  TEAMS: "Teams",
  ROLES: "Roles",
  TALENTS: "Talents",
  RESCHEDULE_TYPES: "Reschedule Types",
} as const;

export const NAVIGATION_DESCRIPTIONS = {
  RELEASE_PLANNER: "Manage releases and timelines",
  PHASES: "Manage base phases",
  PRODUCTS: "Manage products",
  FEATURES: "Manage features by product",
  CALENDARS: "Manage holidays and special days",
  IT_OWNERS: "Manage IT Owners",
  COMPONENT_TYPES: "Manage component types",
  FEATURE_CATEGORIES: "Manage feature categories",
  COUNTRIES: "Manage countries and regions",
  INDICATORS: "Manage KPIs and indicators",
  TEAMS: "Manage teams and talents",
  ROLES: "Manage roles and profiles",
  TALENTS: "Manage talents and resources",
  RESCHEDULE_TYPES: "Manage reschedule types for phase changes",
} as const;

/**
 * Navigation item definition
 */
interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  description?: string;
  children?: NavItem[];
}

/**
 * Props for LeftDrawerContent component
 */
interface LeftDrawerContentProps {
  /**
   * Optional callback when close button is clicked.
   * If not provided, uses default dispatch action.
   */
  onClose?: () => void;
}

/**
 * Navigation items with icons and paths
 */
const NAV_ITEMS: NavItem[] = [
  {
    label: NAVIGATION_LABELS.RELEASE_PLANNER,
    icon: <DashboardIcon />,
    description: "Release planning and configuration",
    children: [
      {
        label: NAVIGATION_LABELS.RELEASE_PLANNER,
        path: "/release-planner",
        icon: <DashboardIcon />,
        description: NAVIGATION_DESCRIPTIONS.RELEASE_PLANNER,
      },
      {
        label: NAVIGATION_LABELS.PHASES,
        path: "/phases-maintenance",
        icon: <PhasesIcon />,
        description: NAVIGATION_DESCRIPTIONS.PHASES,
      },
      {
        label: NAVIGATION_LABELS.CALENDARS,
        path: "/calendars",
        icon: <CalendarsIcon />,
        description: NAVIGATION_DESCRIPTIONS.CALENDARS,
      },
      {
        label: NAVIGATION_LABELS.INDICATORS,
        path: "/indicators-maintenance",
        icon: <IndicatorsIcon />,
        description: NAVIGATION_DESCRIPTIONS.INDICATORS,
      },
      {
        label: NAVIGATION_LABELS.COUNTRIES,
        path: "/countries",
        icon: <CountryIcon />,
        description: NAVIGATION_DESCRIPTIONS.COUNTRIES,
      },
      {
        label: NAVIGATION_LABELS.IT_OWNERS,
        path: "/it-owners",
        icon: <PersonIcon />,
        description: NAVIGATION_DESCRIPTIONS.IT_OWNERS,
      },
      {
        label: NAVIGATION_LABELS.RESCHEDULE_TYPES,
        path: "/reschedule-types-maintenance",
        icon: <RescheduleTypeIcon />,
        description: NAVIGATION_DESCRIPTIONS.RESCHEDULE_TYPES,
      },
    ],
  },
  {
    label: NAVIGATION_LABELS.PRODUCTS,
    icon: <ProductsIcon />,
    description:
      "Manage products, features, component types and feature categories",
    children: [
      {
        label: NAVIGATION_LABELS.PRODUCTS,
        path: "/product-maintenance",
        icon: <ProductsIcon />,
        description: NAVIGATION_DESCRIPTIONS.PRODUCTS,
      },
      {
        label: NAVIGATION_LABELS.FEATURES,
        path: "/features",
        icon: <FeaturesIcon />,
        description: NAVIGATION_DESCRIPTIONS.FEATURES,
      },
      {
        label: NAVIGATION_LABELS.COMPONENT_TYPES,
        path: "/component-types",
        icon: <ComponentTypeIcon />,
        description: NAVIGATION_DESCRIPTIONS.COMPONENT_TYPES,
      },
      {
        label: NAVIGATION_LABELS.FEATURE_CATEGORIES,
        path: "/feature-categories",
        icon: <FeatureCategoryIcon />,
        description: NAVIGATION_DESCRIPTIONS.FEATURE_CATEGORIES,
      },
    ],
  },
  {
    label: NAVIGATION_LABELS.TALENTS,
    icon: <TalentsIcon />,
    description: "Manage teams, roles and talents",
    children: [
      {
        label: NAVIGATION_LABELS.TEAMS,
        path: "/teams-maintenance",
        icon: <TeamsIcon />,
        description: NAVIGATION_DESCRIPTIONS.TEAMS,
      },
      {
        label: NAVIGATION_LABELS.ROLES,
        path: "/roles-maintenance",
        icon: <RolesIcon />,
        description: NAVIGATION_DESCRIPTIONS.ROLES,
      },
      {
        label: NAVIGATION_LABELS.TALENTS,
        path: "/talents-maintenance",
        icon: <TalentsIcon />,
        description: NAVIGATION_DESCRIPTIONS.TALENTS,
      },
    ],
  },
];

export function LeftDrawerContent({ onClose }: LeftDrawerContentProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleClose = onClose || (() => dispatch(toggleLeftSidebar()));

  /**
   * Check if current route is active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Check if any child route is active
   */
  const hasActiveChild = (item: NavItem): boolean => {
    if (item.children) {
      return item.children.some((child) => child.path && isActive(child.path));
    }
    return false;
  };

  /**
   * Handle navigation item click
   * On mobile, closes the drawer after navigation
   */
  const handleNavItemClick = (path: string) => {
    // Navigate first
    navigate(path);
    // Then close on mobile after a brief delay
    if (isMobile) {
      setTimeout(() => {
        handleClose();
      }, 50);
    }
  };

  /**
   * Toggle submenu open/closed
   */
  const handleToggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Box
      role="navigation"
      aria-label="Main navigation"
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      {/* Header Section - Ultra Minimalist */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          minHeight: 48,
        }}
      >
        <Typography
          variant="subtitle2"
          component="span"
          sx={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: theme.palette.text.primary,
            letterSpacing: "-0.01em",
          }}
        >
          {NAVIGATION_LABELS.TITLE}
        </Typography>

        {/* Close button - Only on mobile */}
        {isMobile && (
          <IconButton
            aria-label={NAVIGATION_LABELS.CLOSE}
            size="small"
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary,
              width: 32,
              height: 32,
              "&:hover": {
                backgroundColor: alpha(theme.palette.action.hover, 0.5),
                color: theme.palette.text.primary,
              },
              transition: theme.transitions.create(
                ["background-color", "color"],
                { duration: theme.transitions.duration.shortest }
              ),
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation Links - Minimalist List Design */}
      <Box
        component="nav"
        sx={{
          flex: 1,
          overflow: "auto",
          py: 0.5,
        }}
      >
        <List disablePadding>
          {NAV_ITEMS.map((item, index) => {
            const active = item.path ? isActive(item.path) : false;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus[item.label] || hasActiveChild(item);

            return (
              <React.Fragment key={item.label}>
                <ListItem
                  disablePadding
                  sx={{
                    px: 1.5,
                    mb: 0.125,
                  }}
                >
                  <Tooltip
                    title={item.description || ""}
                    placement="right"
                    arrow
                    enterDelay={300}
                  >
                    <ListItemButton
                      onClick={() => {
                        if (hasChildren) {
                          handleToggleMenu(item.label);
                        } else if (item.path) {
                          handleNavItemClick(item.path);
                        }
                      }}
                      selected={active || hasActiveChild(item)}
                      sx={{
                        borderRadius: 1.5,
                        py: 0.875,
                        px: 1.5,
                        minHeight: 40,
                        transition: theme.transitions.create(
                          ["background-color", "color"],
                          {
                            duration: theme.transitions.duration.shortest,
                            easing: theme.transitions.easing.easeInOut,
                          }
                        ),
                        backgroundColor:
                          active || hasActiveChild(item)
                            ? alpha(theme.palette.primary.main, 0.08)
                            : "transparent",
                        color:
                          active || hasActiveChild(item)
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                        "&:hover": {
                          backgroundColor:
                            active || hasActiveChild(item)
                              ? alpha(theme.palette.primary.main, 0.12)
                              : alpha(theme.palette.action.hover, 0.04),
                        },
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                          color: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.12
                            ),
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 2.5,
                            height: 18,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: "0 2px 2px 0",
                          },
                        },
                        "&:focus-visible": {
                          outline: `2px solid ${theme.palette.primary.main}`,
                          outlineOffset: 2,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: "inherit",
                          "& .MuiSvgIcon-root": {
                            fontSize: 18,
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "0.8125rem",
                          fontWeight:
                            active || hasActiveChild(item) ? 600 : 500,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.4,
                        }}
                      />
                      {hasChildren && (
                        <ListItemIcon
                          sx={{
                            minWidth: 24,
                            color: "inherit",
                            justifyContent: "flex-end",
                            "& .MuiSvgIcon-root": {
                              fontSize: 18,
                            },
                          }}
                        >
                          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItemIcon>
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                {/* Submenu Items */}
                {hasChildren && item.children && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {item.children.map((child) => {
                        const childActive = child.path
                          ? isActive(child.path)
                          : false;
                        return (
                          <ListItem
                            key={child.path}
                            disablePadding
                            sx={{
                              pl: 3.5,
                              pr: 1.5,
                              mb: 0.125,
                            }}
                          >
                            <Tooltip
                              title={child.description || ""}
                              placement="right"
                              arrow
                              enterDelay={300}
                            >
                              <ListItemButton
                                onClick={() =>
                                  child.path && handleNavItemClick(child.path)
                                }
                                selected={childActive}
                                sx={{
                                  borderRadius: 1.5,
                                  py: 0.75,
                                  px: 1.5,
                                  minHeight: 36,
                                  transition: theme.transitions.create(
                                    ["background-color", "color"],
                                    {
                                      duration:
                                        theme.transitions.duration.shortest,
                                      easing:
                                        theme.transitions.easing.easeInOut,
                                    }
                                  ),
                                  backgroundColor: childActive
                                    ? alpha(theme.palette.primary.main, 0.08)
                                    : "transparent",
                                  color: childActive
                                    ? theme.palette.primary.main
                                    : theme.palette.text.secondary,
                                  "&:hover": {
                                    backgroundColor: childActive
                                      ? alpha(theme.palette.primary.main, 0.12)
                                      : alpha(theme.palette.action.hover, 0.04),
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.08
                                    ),
                                    color: theme.palette.primary.main,
                                    "&:hover": {
                                      backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.12
                                      ),
                                    },
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      left: 0,
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      width: 2.5,
                                      height: 16,
                                      backgroundColor:
                                        theme.palette.primary.main,
                                      borderRadius: "0 2px 2px 0",
                                    },
                                  },
                                  "&:focus-visible": {
                                    outline: `2px solid ${theme.palette.primary.main}`,
                                    outlineOffset: 2,
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 32,
                                    color: "inherit",
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 16,
                                    },
                                  }}
                                >
                                  {child.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={child.label}
                                  primaryTypographyProps={{
                                    fontSize: "0.75rem",
                                    fontWeight: childActive ? 600 : 500,
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.4,
                                  }}
                                />
                              </ListItemButton>
                            </Tooltip>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* Footer - Minimalist */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.disabled,
            fontSize: "0.6875rem",
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1.3,
          }}
        >
          Release Planner v1.0
        </Typography>
      </Box>
    </Box>
  );
}
