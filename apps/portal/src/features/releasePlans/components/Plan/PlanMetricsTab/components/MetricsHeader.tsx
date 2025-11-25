import { memo } from "react";
import { Box, Typography, Button, Tooltip, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { PlanMetricsStyles } from "../hooks/usePlanMetricsStyles";

export type MetricsHeaderProps = {
  readonly metricCount: number;
  readonly onAddClick: () => void;
  readonly styles: PlanMetricsStyles;
};

export const MetricsHeader = memo(function MetricsHeader({
  metricCount,
  onAddClick,
  styles,
}: MetricsHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        pb: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        flexShrink: 0,
        flexWrap: { xs: "wrap", sm: "nowrap" },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "0.625rem", sm: "0.6875rem" },
          color: theme.palette.text.primary,
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
        }}
      >
        Indicators ({metricCount})
      </Typography>
      <Tooltip title="Add indicators from maintenance" arrow placement="top">
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          onClick={onAddClick}
          sx={styles.getAddButtonStyles()}
        >
          Add
        </Button>
      </Tooltip>
    </Box>
  );
});

