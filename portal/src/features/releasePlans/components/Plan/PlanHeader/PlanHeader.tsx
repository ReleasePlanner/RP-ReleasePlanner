/**
 * Material Design minimalista - PlanHeader refactorizado
 *
 * Mejoras aplicadas:
 * ✅ Iconografía coherente de Material Symbols
 * ✅ Estados visuales claros y consistentes
 * ✅ Animaciones suaves y apropiadas
 * ✅ Tipografía jerárquica Material Design
 * ✅ Accesibilidad mejorada (ARIA, keyboard navigation)
 * ✅ Espaciado basado en grilla 8px
 * ✅ Colores del sistema de tema
 * ✅ Selectores de Producto e IT Owner integrados
 */

import {
  CardHeader,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
} from "@mui/material";
import type { Theme, SelectChangeEvent } from "@mui/material";
import {
  ExpandMore,
  CheckCircleOutline,
  PlayCircleOutline,
  PauseCircleOutline,
  CalendarMonth,
  AccessTime,
} from "@mui/icons-material";
import { useAppSelector } from "@/store/hooks";
import { IT_OWNERS } from "../../../constants/itOwners";

export type PlanStatus = "planned" | "in_progress" | "done" | "paused";

export type PlanHeaderProps = {
  id: string;
  name: string;
  status: PlanStatus;
  startDate: string;
  endDate: string;
  productId?: string;
  itOwner?: string;
  description?: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onProductChange?: (productId: string) => void;
  onITOwnerChange?: (itOwnerId: string) => void;
};

interface StatusConfig {
  label: string;
  icon: React.ReactElement;
  color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  bgColor: string;
}

const getStatusConfig = (status: PlanStatus, theme: Theme): StatusConfig => {
  const configs: Record<PlanStatus, StatusConfig> = {
    planned: {
      label: "Planned",
      icon: <PauseCircleOutline sx={{ fontSize: 14 }} />,
      color: "default",
      bgColor: alpha(theme.palette.grey[500], 0.08),
    },
    in_progress: {
      label: "In Progress",
      icon: <PlayCircleOutline sx={{ fontSize: 14 }} />,
      color: "primary",
      bgColor: alpha(theme.palette.primary.main, 0.08),
    },
    done: {
      label: "Completed",
      icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
      color: "success",
      bgColor: alpha(theme.palette.success.main, 0.08),
    },
    paused: {
      label: "Paused",
      icon: <PauseCircleOutline sx={{ fontSize: 14 }} />,
      color: "warning",
      bgColor: alpha(theme.palette.warning.main, 0.08),
    },
  };

  return configs[status];
};

export default function PlanHeader({
  id,
  name,
  status,
  startDate,
  endDate,
  productId,
  itOwner,
  description,
  expanded,
  onToggleExpanded,
  onProductChange,
  onITOwnerChange,
}: PlanHeaderProps) {
  const theme = useTheme();
  const statusConfig = getStatusConfig(status, theme);

  // Calculate duration in days
  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffTime = Math.abs(endTime - startTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(startDate, endDate);
  const products = useAppSelector((state) => state.products.products);

  // Format date range
  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  };

  return (
    <CardHeader
      sx={{
        px: 2,
        py: 2,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        position: "sticky",
        top: 0,
        zIndex: 2,
        transition: theme.transitions.create(
          ["background-color", "border-color"],
          {
            duration: theme.transitions.duration.short,
          }
        ),
      }}
      title={
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* First Row: ID, Name, Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Plan ID */}
            <Chip
              label={`ID: ${id}`}
              size="small"
              variant="outlined"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderColor: alpha(theme.palette.divider, 0.3),
                color: theme.palette.text.secondary,
              }}
            />

            {/* Plan Name */}
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: "1.125rem",
                lineHeight: 1.3,
                color: theme.palette.text.primary,
                minWidth: 0,
                flex: 1,
              }}
            >
              {name}
            </Typography>

            {/* Status chip */}
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              size="small"
              variant="filled"
              color={statusConfig.color}
              sx={{
                height: 24,
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: statusConfig.bgColor,
                color:
                  statusConfig.color === "default"
                    ? theme.palette.grey[700]
                    : (theme.palette[statusConfig.color] as { main: string })
                        .main,
                border: "none",
                "& .MuiChip-icon": {
                  marginLeft: 0.5,
                  marginRight: -0.25,
                },
              }}
            />
          </Box>

          {/* Second Row: Date Range and Duration */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {/* Date Range */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarMonth
                sx={{ fontSize: 16, color: theme.palette.text.secondary }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8125rem",
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                {formatDateRange(startDate, endDate)}
              </Typography>
            </Box>

            {/* Duration */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <AccessTime
                sx={{ fontSize: 16, color: theme.palette.text.secondary }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8125rem",
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                {duration} days
              </Typography>
            </Box>
          </Box>

          {/* Third Row: Product and IT Owner Selectors */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Product Selector */}
            <FormControl
              size="small"
              sx={{
                minWidth: 200,
                flex: { xs: "1 1 100%", sm: "1 1 auto" },
              }}
            >
              <InputLabel id={`product-select-label-${id}`}>Product</InputLabel>
              <Select
                labelId={`product-select-label-${id}`}
                id={`product-select-${id}`}
                value={productId || ""}
                label="Product"
                onChange={(e: SelectChangeEvent) => {
                  if (onProductChange) {
                    onProductChange(e.target.value);
                  }
                }}
                sx={{
                  fontSize: "0.875rem",
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* IT Owner Selector */}
            <FormControl
              size="small"
              sx={{
                minWidth: 200,
                flex: { xs: "1 1 100%", sm: "1 1 auto" },
              }}
            >
              <InputLabel id={`it-owner-select-label-${id}`}>
                IT Owner
              </InputLabel>
              <Select
                labelId={`it-owner-select-label-${id}`}
                id={`it-owner-select-${id}`}
                value={itOwner || ""}
                label="IT Owner"
                onChange={(e: SelectChangeEvent) => {
                  if (onITOwnerChange) {
                    onITOwnerChange(e.target.value);
                  }
                }}
                sx={{
                  fontSize: "0.875rem",
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {IT_OWNERS.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      }
      subheader={
        description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              lineHeight: 1.4,
              fontSize: "0.875rem",
            }}
          >
            {description}
          </Typography>
        )
      }
      action={
        <Tooltip
          title={expanded ? "Collapse plan" : "Expand plan"}
          placement="top"
          arrow
        >
          <IconButton
            onClick={onToggleExpanded}
            aria-label={expanded ? "Collapse plan" : "Expand plan"}
            aria-expanded={expanded}
            size="medium"
            sx={{
              ml: 1,
              color: theme.palette.action.active,
              transition: theme.transitions.create(
                ["transform", "color", "background-color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                color: theme.palette.primary.main,
              },
              "&:focus-visible": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
          >
            <ExpandMore />
          </IconButton>
        </Tooltip>
      }
    />
  );
}
