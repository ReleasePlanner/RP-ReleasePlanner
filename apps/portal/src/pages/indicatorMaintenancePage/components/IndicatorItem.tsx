import { memo } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Indicator } from "@/api/services/indicators.service";

export type IndicatorItemProps = {
  readonly indicator: Indicator;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (indicator: Indicator) => void;
  readonly onDelete: (indicatorId: string) => void;
};

/**
 * Component for a single indicator item in the list
 */
export const IndicatorItem = memo(function IndicatorItem({
  indicator,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: IndicatorItemProps) {
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
          px: 2,
          py: 1.5,
          transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {/* Indicator Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: theme.palette.text.primary,
              mb: 0.25,
            }}
          >
            {indicator.name}
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            <Chip
              label={indicator.status}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.625rem",
                fontWeight: 500,
                bgcolor: alpha(getStatusColor(indicator.status), 0.1),
                color: getStatusColor(indicator.status),
                "& .MuiChip-label": {
                  px: 0.75,
                  textTransform: "capitalize",
                },
              }}
            />
            {indicator.description && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6875rem",
                  color: theme.palette.text.secondary,
                  maxWidth: "400px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {indicator.description}
              </Typography>
            )}
          </Stack>
          {indicator.formula && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                color: theme.palette.text.disabled,
                fontFamily: "monospace",
                mt: 0.5,
                display: "block",
              }}
            >
              Formula: {indicator.formula}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit Indicator">
            <IconButton
              size="small"
              onClick={() => onEdit(indicator)}
              sx={{
                fontSize: 16,
                p: 0.75,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Indicator">
            <IconButton
              size="small"
              onClick={() => onDelete(indicator.id)}
              disabled={isDeleting}
              sx={{
                fontSize: 16,
                p: 0.75,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              {isDeleting ? (
                <CircularProgress size={14} />
              ) : (
                <DeleteIcon fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      {!isLast && (
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
      )}
    </Box>
  );
});

