import { memo } from "react";
import { Box, Typography, Stack, Chip, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import type { Indicator } from "@/api/services/indicators.service";
import type { PlanMetricsStyles } from "../hooks/usePlanMetricsStyles";

export type MetricItemProps = {
  readonly metric: Indicator;
  readonly isLast: boolean;
  readonly onDelete: (id: string) => void;
  readonly styles: PlanMetricsStyles;
};

export const MetricItem = memo(function MetricItem({
  metric,
  isLast,
  onDelete,
  styles,
}: MetricItemProps) {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'archived':
        return theme.palette.text.disabled;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.75, sm: 1 },
          px: { xs: 1, sm: 1.25 },
          py: { xs: 0.75, sm: 1 },
          transition: theme.transitions.create(["background-color", "border-color"], {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
          <Tooltip title="Delete indicator" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => onDelete(metric.id)}
              sx={{
                fontSize: { xs: 14, sm: 16 },
                p: { xs: 0.375, sm: 0.5 },
                color: theme.palette.text.secondary,
                transition: theme.transitions.create(["color", "background-color"], {
                  duration: theme.transitions.duration.shorter,
                }),
                "&:hover": {
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Metric Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.6875rem", sm: "0.75rem" },
              fontWeight: 500,
              color: theme.palette.text.primary,
              mb: 0.125,
              lineHeight: 1.4,
            }}
          >
            {metric.name}
          </Typography>
          {metric.description && (
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                color: theme.palette.text.secondary,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {metric.description}
            </Typography>
          )}
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 0.75 }}
            sx={{ mt: 0.25 }}
            flexWrap="wrap"
          >
            <Chip
              label={metric.status}
              size="small"
              sx={{
                height: { xs: 16, sm: 18 },
                fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                fontWeight: 500,
                bgcolor: alpha(getStatusColor(metric.status), 0.1),
                color: getStatusColor(metric.status),
                textTransform: "capitalize",
                "& .MuiChip-label": {
                  px: { xs: 0.5, sm: 0.625 },
                },
              }}
            />
            {metric.formula && (
              <Chip
                label="Has Formula"
                size="small"
                sx={{
                  height: { xs: 16, sm: 18 },
                  fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                  fontWeight: 500,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  "& .MuiChip-label": {
                    px: { xs: 0.5, sm: 0.625 },
                  },
                }}
              />
            )}
          </Stack>
        </Box>
      </Box>
      {!isLast && (
        <Box
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        />
      )}
    </Box>
  );
});

