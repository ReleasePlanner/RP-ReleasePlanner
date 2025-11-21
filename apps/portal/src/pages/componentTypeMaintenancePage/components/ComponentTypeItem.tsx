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
import type { ComponentType } from "@/api/services/componentTypes.service";

export type ComponentTypeItemProps = {
  readonly type: ComponentType;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (type: ComponentType) => void;
  readonly onDelete: (typeId: string) => void;
};

/**
 * Component for a single component type item in the list
 */
export const ComponentTypeItem = memo(function ComponentTypeItem({
  type,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: ComponentTypeItemProps) {
  const theme = useTheme();

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
        {/* Component Type Info */}
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
            {type.name}
          </Typography>
          {type.code && (
            <Chip
              label={type.code}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.625rem",
                fontWeight: 500,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                "& .MuiChip-label": {
                  px: 0.75,
                },
                mb: 0.5,
              }}
            />
          )}
          {type.description && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                color: theme.palette.text.secondary,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {type.description}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit Component Type">
            <IconButton
              size="small"
              onClick={() => onEdit(type)}
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
          <Tooltip title="Delete Component Type">
            <IconButton
              size="small"
              onClick={() => onDelete(type.id)}
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

