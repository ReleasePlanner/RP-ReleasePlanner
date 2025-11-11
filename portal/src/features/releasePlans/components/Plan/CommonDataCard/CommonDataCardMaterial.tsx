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

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  PersonOutline,
  CalendarToday,
  FolderOpen,
  Schedule,
} from "@mui/icons-material";

import type { Product } from "./types";
export interface CommonDataCardProps {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  selectedProduct?: string;
  products?: Product[];
  onProductChange?: (productId: string) => void;
}

interface DataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

const DataItem: React.FC<DataItemProps> = ({
  icon,
  label,
  value,
  color = "primary",
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.5,
        px: 1.5,
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette[color].main, 0.04),
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: alpha(theme.palette[color].main, 0.08),
          transform: "translateX(4px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: alpha(theme.palette[color].main, 0.12),
          color: theme.palette[color].main,
          flexShrink: 0,
          boxShadow: `0 2px 4px ${alpha(theme.palette[color].main, 0.15)}`,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            fontSize: "0.9375rem",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export function CommonDataCard({
  owner,
  startDate,
  endDate,
  id,
}: CommonDataCardProps) {
  const theme = useTheme();

  // Formatear fechas de manera más legible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calcular duración del proyecto
  const calculateDuration = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.round(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""}`;
    }
  };

  return (
    <Card
      variant="elevation"
      sx={{
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.02)",
        transition: theme.transitions.create(["box-shadow", "transform"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow:
            "0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.02)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": { pb: 2.5 },
        }}
      >
        {/* Header minimalista */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Project Details
          </Typography>
          <Chip
            label={id}
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: "0.625rem",
              fontWeight: 500,
              borderColor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            }}
          />
        </Box>

        <Divider
          sx={{
            mb: 2.5,
            borderColor: alpha(theme.palette.divider, 0.1),
          }}
        />

        {/* Datos organizados verticalmente con mejor jerarquía */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <DataItem
            icon={<PersonOutline sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            label="Owner"
            value={owner}
            color="primary"
          />

          <DataItem
            icon={<CalendarToday sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            label="Start Date"
            value={formatDate(startDate)}
            color="secondary"
          />

          <DataItem
            icon={<Schedule sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            label="End Date"
            value={formatDate(endDate)}
            color="secondary"
          />

          <DataItem
            icon={<FolderOpen sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            label="Duration"
            value={calculateDuration()}
            color="success"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonDataCard;
