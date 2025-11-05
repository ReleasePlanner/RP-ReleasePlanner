/**
 * Material Design minimalista - CommonDataCard refactorizada
 *
 * Mejoras aplicadas:
 * ✅ Seguimiento estricto de Material Design 3.0
 * ✅ Iconografía coherente y minimalista
 * ✅ Espaciado consistente basado en grilla 8px
 * ✅ Tipografía jerárquica clara
 * ✅ Estados de interacción apropiados
 * ✅ Accesibilidad mejorada (a11y)
 * ✅ Colores del tema integrados
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
  alpha,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  PersonOutline,
  CalendarToday,
  FolderOpen,
  Schedule,
  Inventory,
  Web as WebIcon,
  PhoneAndroid as MobileIcon,
  Cloud as ServiceIcon,
  Dashboard as PortalIcon,
  Api as ApiIcon,
  Storage as DatabaseIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Flag as FeaturesIcon,
  Assignment as RequirementIcon,
  Group as TeamIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import type {
  CommonDataCardProps,
  Product,
  ComponentVersion,
  FeatureVersion,
  ViewMode,
} from "./types";
import { getProductById } from "../../../lib/productData";

export type { CommonDataCardProps };

interface DataRowProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  isStatus?: boolean;
}

interface ProductSelectorProps {
  selectedProduct?: string;
  products: Product[];
  onProductChange: (productId: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ComponentConfig {
  name: string;
  icon: React.ReactElement;
  color: "primary" | "secondary" | "success" | "info" | "warning";
  description: string;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`common-data-tabpanel-${index}`}
      aria-labelledby={`common-data-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `common-data-tab-${index}`,
    "aria-controls": `common-data-tabpanel-${index}`,
  };
}

const getComponentConfig = (component: ComponentVersion): ComponentConfig => {
  const type = component.type.toLowerCase();

  // Use component type first, then fallback to name-based detection
  switch (type) {
    case "web":
    case "portal":
      return {
        name: component.name,
        icon: <WebIcon />,
        color: "primary",
        description:
          component.description || "Frontend web application or portal",
      };

    case "mobile":
      return {
        name: component.name,
        icon: <MobileIcon />,
        color: "secondary",
        description: component.description || "Mobile application",
      };

    case "service":
    case "api":
      return {
        name: component.name,
        icon: <ServiceIcon />,
        color: "success",
        description: component.description || "Backend service or API",
      };

    case "dashboard":
      return {
        name: component.name,
        icon: <PortalIcon />,
        color: "info",
        description:
          component.description || "Dashboard or analytics interface",
      };

    case "gateway":
      return {
        name: component.name,
        icon: <ApiIcon />,
        color: "warning",
        description: component.description || "API Gateway or routing service",
      };

    default:
      return {
        name: component.name,
        icon: <DatabaseIcon />,
        color: "primary",
        description: component.description || "System component",
      };
  }
};

function ComponentCard({
  config,
  component,
}: {
  config: ComponentConfig;
  component: ComponentVersion;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        transition: theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        {/* Header with Icon and Name */}
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 1.5,
              backgroundColor: alpha(theme.palette[config.color].main, 0.1),
              color: theme.palette[config.color].main,
              mr: 1.5,
              "& .MuiSvgIcon-root": {
                fontSize: 20,
              },
            }}
          >
            {config.icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {component.name}
            </Typography>

            {/* Version and Status Row */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              {component.version && (
                <Chip
                  label={`v${component.version}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    borderColor: alpha(theme.palette.text.secondary, 0.3),
                    color: theme.palette.text.secondary,
                  }}
                />
              )}
              {component.status && (
                <Chip
                  label={component.status}
                  size="small"
                  color={
                    component.status === "production"
                      ? "success"
                      : component.status === "testing"
                      ? "warning"
                      : component.status === "development"
                      ? "info"
                      : "default"
                  }
                  sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500 }}
                />
              )}
            </Box>

            {/* Type Badge */}
            <Chip
              label={
                component.type.charAt(0).toUpperCase() + component.type.slice(1)
              }
              size="small"
              color={config.color}
              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 500 }}
            />
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.75rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            "-webkit-line-clamp": 2,
            "-webkit-box-orient": "vertical",
            overflow: "hidden",
            mb: 1,
          }}
        >
          {config.description}
        </Typography>

        {/* Last Updated */}
        {component.lastUpdated && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.65rem", fontStyle: "italic" }}
          >
            Updated: {new Date(component.lastUpdated).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function ComponentListItem({
  config,
  component,
}: {
  config: ComponentConfig;
  component: ComponentVersion;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        transition: theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          transform: "translateX(2px)",
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette[config.color].main, 0.1),
              color: theme.palette[config.color].main,
              flexShrink: 0,
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            {config.icon}
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {component.name}
              </Typography>

              <Chip
                label={
                  component.type.charAt(0).toUpperCase() +
                  component.type.slice(1)
                }
                size="small"
                color={config.color}
                sx={{ height: 18, fontSize: "0.65rem", fontWeight: 500 }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {config.description}
            </Typography>
          </Box>

          {/* Version and Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              flexShrink: 0,
            }}
          >
            {component.version && (
              <Chip
                label={`v${component.version}`}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  borderColor: alpha(theme.palette.text.secondary, 0.3),
                  color: theme.palette.text.secondary,
                }}
              />
            )}
            {component.status && (
              <Chip
                label={component.status}
                size="small"
                color={
                  component.status === "production"
                    ? "success"
                    : component.status === "testing"
                    ? "warning"
                    : component.status === "development"
                    ? "info"
                    : "default"
                }
                sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500 }}
              />
            )}
          </Box>

          {/* Last Updated */}
          {component.lastUpdated && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{
                fontSize: "0.65rem",
                fontStyle: "italic",
                flexShrink: 0,
                width: 80,
                textAlign: "right",
              }}
            >
              {new Date(component.lastUpdated).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ feature }: { feature: FeatureVersion }) {
  const theme = useTheme();

  const getPriorityConfig = (priority?: string) => {
    switch (priority) {
      case "critical":
        return { color: "error" as const, icon: <FeaturesIcon /> };
      case "high":
        return { color: "warning" as const, icon: <RequirementIcon /> };
      case "medium":
        return { color: "info" as const, icon: <RequirementIcon /> };
      case "low":
        return { color: "success" as const, icon: <RequirementIcon /> };
      default:
        return { color: "primary" as const, icon: <RequirementIcon /> };
    }
  };

  const config = getPriorityConfig(feature.priority);

  return (
    <Card
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        transition: theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        {/* Header with Icon and Name */}
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 1.5,
              backgroundColor: alpha(theme.palette[config.color].main, 0.1),
              color: theme.palette[config.color].main,
              mr: 1.5,
              "& .MuiSvgIcon-root": {
                fontSize: 20,
              },
            }}
          >
            {config.icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {feature.name}
            </Typography>

            {/* Priority and Status Row */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              {feature.priority && (
                <Chip
                  label={feature.priority}
                  size="small"
                  color={config.color}
                  sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500 }}
                />
              )}
              {feature.status && (
                <Chip
                  label={feature.status}
                  size="small"
                  color={
                    feature.status === "completed"
                      ? "success"
                      : feature.status === "in-progress"
                      ? "info"
                      : feature.status === "testing"
                      ? "warning"
                      : feature.status === "blocked"
                      ? "error"
                      : "default"
                  }
                  sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500 }}
                />
              )}
            </Box>

            {/* Category and Team */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {feature.category && (
                <Chip
                  label={
                    feature.category.charAt(0).toUpperCase() +
                    feature.category.slice(1)
                  }
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    borderColor: alpha(theme.palette.text.secondary, 0.3),
                    color: theme.palette.text.secondary,
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.75rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            "-webkit-line-clamp": 2,
            "-webkit-box-orient": "vertical",
            overflow: "hidden",
            mb: 1,
          }}
        >
          {feature.description}
        </Typography>

        {/* Bottom Row: Team and Estimated Hours */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          {feature.assignedTeam && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TeamIcon
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.disabled,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.65rem" }}
              >
                {feature.assignedTeam}
              </Typography>
            </Box>
          )}
          {feature.estimatedHours && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TimeIcon
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.disabled,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.65rem" }}
              >
                {feature.estimatedHours}h
              </Typography>
            </Box>
          )}
        </Box>

        {/* Last Updated */}
        {feature.lastUpdated && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              fontSize: "0.65rem",
              fontStyle: "italic",
              display: "block",
              mt: 0.5,
            }}
          >
            Updated: {new Date(feature.lastUpdated).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function FeatureListItem({ feature }: { feature: FeatureVersion }) {
  const theme = useTheme();

  const getPriorityConfig = (priority?: string) => {
    switch (priority) {
      case "critical":
        return { color: "error" as const, icon: <FeaturesIcon /> };
      case "high":
        return { color: "warning" as const, icon: <RequirementIcon /> };
      case "medium":
        return { color: "info" as const, icon: <RequirementIcon /> };
      case "low":
        return { color: "success" as const, icon: <RequirementIcon /> };
      default:
        return { color: "primary" as const, icon: <RequirementIcon /> };
    }
  };

  const config = getPriorityConfig(feature.priority);

  return (
    <Card
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        transition: theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          transform: "translateX(2px)",
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette[config.color].main, 0.1),
              color: theme.palette[config.color].main,
              flexShrink: 0,
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            {config.icon}
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {feature.name}
              </Typography>

              {feature.category && (
                <Chip
                  label={
                    feature.category.charAt(0).toUpperCase() +
                    feature.category.slice(1)
                  }
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    borderColor: alpha(theme.palette.text.secondary, 0.3),
                    color: theme.palette.text.secondary,
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.25,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {feature.description}
              </Typography>
            </Box>

            {/* Team and Hours */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {feature.assignedTeam && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TeamIcon
                    sx={{
                      fontSize: "0.7rem",
                      color: theme.palette.text.disabled,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    {feature.assignedTeam}
                  </Typography>
                </Box>
              )}
              {feature.estimatedHours && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TimeIcon
                    sx={{
                      fontSize: "0.7rem",
                      color: theme.palette.text.disabled,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    {feature.estimatedHours}h
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Priority and Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              flexShrink: 0,
            }}
          >
            {feature.priority && (
              <Chip
                label={feature.priority}
                size="small"
                color={config.color}
                sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500 }}
              />
            )}
            {feature.status && (
              <Chip
                label={feature.status}
                size="small"
                color={
                  feature.status === "completed"
                    ? "success"
                    : feature.status === "in-progress"
                    ? "info"
                    : feature.status === "testing"
                    ? "warning"
                    : feature.status === "blocked"
                    ? "error"
                    : "default"
                }
                sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500 }}
              />
            )}
          </Box>

          {/* Last Updated */}
          {feature.lastUpdated && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{
                fontSize: "0.65rem",
                fontStyle: "italic",
                flexShrink: 0,
                width: 80,
                textAlign: "right",
              }}
            >
              {new Date(feature.lastUpdated).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function ComponentsPanel({
  selectedProduct,
  viewMode,
  onViewModeChange,
}: {
  selectedProduct?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const theme = useTheme();
  const product = selectedProduct ? getProductById(selectedProduct) : null;

  if (!selectedProduct || !product) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
          textAlign: "center",
          py: 3,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5, fontWeight: 500 }}
          >
            No Product Selected
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select a product to view its components.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (product.components.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
          border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No components defined for this product.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Components Header with View Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {product.components.length} Component
          {product.components.length !== 1 ? "s" : ""}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Grid view">
            <IconButton
              size="small"
              onClick={() => onViewModeChange("grid")}
              sx={{
                color:
                  viewMode === "grid"
                    ? theme.palette.primary.main
                    : theme.palette.action.active,
                backgroundColor:
                  viewMode === "grid"
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
              }}
            >
              <GridViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="List view">
            <IconButton
              size="small"
              onClick={() => onViewModeChange("list")}
              sx={{
                color:
                  viewMode === "list"
                    ? theme.palette.primary.main
                    : theme.palette.action.active,
                backgroundColor:
                  viewMode === "list"
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
              }}
            >
              <ListViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Components Grid/List */}
      {viewMode === "grid" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          {product.components.map((component: ComponentVersion) => {
            const config = getComponentConfig(component);
            return (
              <ComponentCard
                key={component.id}
                config={config}
                component={component}
              />
            );
          })}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {product.components.map((component: ComponentVersion) => {
            const config = getComponentConfig(component);
            return (
              <ComponentListItem
                key={component.id}
                config={config}
                component={component}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}

function FeaturesPanel({
  selectedProduct,
  viewMode,
  onViewModeChange,
}: {
  selectedProduct?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const theme = useTheme();
  const product = selectedProduct ? getProductById(selectedProduct) : null;

  if (!selectedProduct || !product) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
          textAlign: "center",
          py: 3,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5, fontWeight: 500 }}
          >
            No Product Selected
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select a product to view its features.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (product.features.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
          border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No features defined for this product.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Features Header with View Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {product.features.length} Feature
          {product.features.length !== 1 ? "s" : ""}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Grid view">
            <IconButton
              size="small"
              onClick={() => onViewModeChange("grid")}
              sx={{
                color:
                  viewMode === "grid"
                    ? theme.palette.primary.main
                    : theme.palette.action.active,
                backgroundColor:
                  viewMode === "grid"
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
              }}
            >
              <GridViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="List view">
            <IconButton
              size="small"
              onClick={() => onViewModeChange("list")}
              sx={{
                color:
                  viewMode === "list"
                    ? theme.palette.primary.main
                    : theme.palette.action.active,
                backgroundColor:
                  viewMode === "list"
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
              }}
            >
              <ListViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Features Grid/List */}
      {viewMode === "grid" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          {product.features.map((feature: FeatureVersion) => {
            return <FeatureCard key={feature.id} feature={feature} />;
          })}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {product.features.map((feature: FeatureVersion) => {
            return <FeatureListItem key={feature.id} feature={feature} />;
          })}
        </Box>
      )}
    </Box>
  );
}

function ProductSelector({
  selectedProduct,
  products,
  onProductChange,
}: ProductSelectorProps) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onProductChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.5,
        px: 0,
        minHeight: 40,
        transition: theme.transitions.create(["background-color"], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          mr: 2,
          flexShrink: 0,
          "& .MuiSvgIcon-root": {
            fontSize: 18,
          },
        }}
      >
        <Inventory />
      </Box>

      {/* Label */}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: "0.875rem",
          lineHeight: 1.4,
          minWidth: 80,
          mr: 2,
          flexShrink: 0,
        }}
      >
        Product
      </Typography>

      {/* Product Select */}
      <FormControl
        size="small"
        sx={{
          flex: 1,
          minWidth: 120,
          "& .MuiOutlinedInput-root": {
            fontSize: "0.875rem",
            height: 32,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            transition: theme.transitions.create(
              ["border-color", "box-shadow"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.primary.main, 0.5),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.75rem",
            transform: "translate(12px, 8px) scale(1)",
            "&.Mui-focused, &.MuiFormLabel-filled": {
              transform: "translate(12px, -6px) scale(0.75)",
            },
          },
        }}
      >
        <InputLabel id="product-select-label">Select Product</InputLabel>
        <Select
          labelId="product-select-label"
          value={selectedProduct || ""}
          onChange={handleChange}
          label="Select Product"
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: {
                boxShadow: theme.shadows[3],
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                mt: 0.5,
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  py: 1,
                  px: 2,
                  transition: theme.transitions.create(["background-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                  "&.Mui-selected": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>Select a product...</em>
          </MenuItem>
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                >
                  {product.name}
                </Typography>
                {product.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mt: 0.25 }}
                  >
                    {product.description}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontSize: "0.7rem", mt: 0.25, fontStyle: "italic" }}
                >
                  Components: {product.components.join(", ")}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function DataRow({ icon, label, value, isStatus = false }: DataRowProps) {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planned":
        return {
          color: theme.palette.info.main,
          bg: alpha(theme.palette.info.main, 0.08),
        };
      case "in_progress":
      case "active":
        return {
          color: theme.palette.primary.main,
          bg: alpha(theme.palette.primary.main, 0.08),
        };
      case "done":
      case "completed":
        return {
          color: theme.palette.success.main,
          bg: alpha(theme.palette.success.main, 0.08),
        };
      case "paused":
      case "on_hold":
        return {
          color: theme.palette.warning.main,
          bg: alpha(theme.palette.warning.main, 0.08),
        };
      default:
        return {
          color: theme.palette.text.secondary,
          bg: alpha(theme.palette.grey[500], 0.08),
        };
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.5,
        px: 0,
        minHeight: 40,
        transition: theme.transitions.create(["background-color"], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          mr: 2,
          flexShrink: 0,
          "& .MuiSvgIcon-root": {
            fontSize: 18,
          },
        }}
      >
        {icon}
      </Box>

      {/* Label */}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: "0.875rem",
          lineHeight: 1.4,
          minWidth: 80,
          mr: 2,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>

      {/* Value */}
      {isStatus ? (
        <Chip
          label={value}
          size="small"
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 500,
            ...getStatusColor(value),
            backgroundColor: getStatusColor(value).bg,
            color: getStatusColor(value).color,
            border: "none",
            textTransform: "capitalize",
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: 1.4,
            flex: 1,
            wordBreak: "break-word",
          }}
        >
          {value || "—"}
        </Typography>
      )}
    </Box>
  );
}

export default function CommonDataCard({
  owner,
  startDate,
  endDate,
  id,
  selectedProduct,
  products = [],
  onProductChange,
}: CommonDataCardProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const dateRange =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : startDate
      ? `From ${formatDate(startDate)}`
      : endDate
      ? `Until ${formatDate(endDate)}`
      : "—";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        transition: theme.transitions.create(["box-shadow", "border-color"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          boxShadow: theme.shadows[2],
          borderColor: alpha(theme.palette.primary.main, 0.24),
        },
      }}
    >
      {/* Header with Tabs */}
      <Box
        sx={{
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          px: 3,
          pt: 3,
          pb: 0,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FolderOpen
            sx={{ fontSize: 20, color: theme.palette.primary.main }}
          />
          Plan Data
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="plan data tabs"
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              px: 2,
              py: 1,
              transition: theme.transitions.create(
                ["color", "background-color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: 1,
            },
          }}
        >
          <Tab label="Common Data" {...a11yProps(0)} />
          <Tab label="Components" {...a11yProps(1)} />
          <Tab label="Features" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {/* Tab Panel 1: Common Data */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <DataRow
              icon={<PersonOutline />}
              label="Owner"
              value={owner || "—"}
            />

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            <DataRow
              icon={<CalendarToday />}
              label="Duration"
              value={dateRange}
            />

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            {/* Product Selector */}
            {onProductChange && (
              <>
                <ProductSelector
                  selectedProduct={selectedProduct}
                  products={products}
                  onProductChange={onProductChange}
                />

                <Divider sx={{ my: 1, opacity: 0.6 }} />
              </>
            )}

            <DataRow icon={<Schedule />} label="ID" value={id || "—"} />
          </Box>
        </TabPanel>

        {/* Tab Panel 2: Components */}
        <TabPanel value={activeTab} index={1}>
          <ComponentsPanel
            selectedProduct={selectedProduct}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </TabPanel>

        {/* Tab Panel 3: Features */}
        <TabPanel value={activeTab} index={2}>
          <FeaturesPanel
            selectedProduct={selectedProduct}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </TabPanel>
      </CardContent>
    </Card>
  );
}
