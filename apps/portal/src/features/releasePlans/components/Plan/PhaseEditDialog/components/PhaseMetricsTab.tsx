import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { Indicator } from "@/api/services/indicators.service";
import { usePlanMetrics } from "../../PlanMetricsTab/hooks/usePlanMetrics";

export type PhaseMetricValue = {
  indicatorId: string;
  value: string;
};

export type PhaseMetricsTabProps = {
  readonly indicatorIds: string[];
  readonly phaseId: string;
  readonly metricValues: Record<string, string>; // indicatorId -> value
  readonly onMetricValueChange: (indicatorId: string, value: string) => void;
  readonly isSaving?: boolean;
  readonly hasPendingChanges?: boolean;
  readonly onSave?: () => void;
};

export function PhaseMetricsTab({
  indicatorIds,
  phaseId,
  metricValues,
  onMetricValueChange,
  isSaving = false,
  hasPendingChanges = false,
  onSave,
}: PhaseMetricsTabProps) {
  const theme = useTheme();
  const { planMetrics, isLoading, hasError } = usePlanMetrics(indicatorIds);

  const handleValueChange = useCallback(
    (indicatorId: string, value: string) => {
      onMetricValueChange(indicatorId, value);
    },
    [onMetricValueChange]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.palette.success.main;
      case "inactive":
        return theme.palette.warning.main;
      case "archived":
        return theme.palette.text.disabled;
      default:
        return theme.palette.text.secondary;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          Loading metrics...
        </Typography>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Error loading metrics. Please try again.</Alert>
      </Box>
    );
  }

  if (planMetrics.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No metrics assigned to this plan.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {onSave && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: 1.5,
            py: 0.75,
            mb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          }}
        >
          <Tooltip
            title={
              isSaving
                ? "Saving..."
                : hasPendingChanges
                  ? "Save metrics"
                  : "No pending changes"
            }
            arrow
            placement="bottom"
          >
            <span>
              <IconButton
                onClick={onSave}
                disabled={isSaving || !hasPendingChanges}
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: hasPendingChanges
                    ? theme.palette.primary.main
                    : alpha(theme.palette.action.disabled, 0.1),
                  color: hasPendingChanges
                    ? theme.palette.primary.contrastText
                    : theme.palette.action.disabled,
                  "&:hover": {
                    backgroundColor: hasPendingChanges
                      ? theme.palette.primary.dark
                      : alpha(theme.palette.action.disabled, 0.1),
                  },
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
      <Box sx={{ pt: 1, width: "100%" }}>
        <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
          maxHeight: 400,
          overflow: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.8)
                      : theme.palette.background.paper,
                }}
              >
                Metric
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.8)
                      : theme.palette.background.paper,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.8)
                      : theme.palette.background.paper,
                  width: "40%",
                }}
              >
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planMetrics.map((metric: Indicator) => (
              <TableRow key={metric.id} hover>
                <TableCell sx={{ py: 1.5 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        color: theme.palette.text.primary,
                        mb: 0.5,
                      }}
                    >
                      {metric.name}
                    </Typography>
                    {metric.description && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.6875rem",
                          color: theme.palette.text.secondary,
                          display: "block",
                        }}
                      >
                        {metric.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Chip
                    label={metric.status}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      bgcolor: alpha(getStatusColor(metric.status), 0.1),
                      color: getStatusColor(metric.status),
                      textTransform: "capitalize",
                      "& .MuiChip-label": {
                        px: 0.75,
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={metricValues[metric.id] || ""}
                    onChange={(e) => handleValueChange(metric.id, e.target.value)}
                    placeholder="Enter value..."
                    disabled={isSaving}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.75rem",
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
  );
}

