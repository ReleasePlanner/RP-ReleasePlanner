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
import type { ITOwner } from "@/api/services/itOwners.service";

export type ITOwnerItemProps = {
  readonly owner: ITOwner;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (owner: ITOwner) => void;
  readonly onDelete: (ownerId: string) => void;
};

/**
 * Component for a single IT owner item in the list
 */
export const ITOwnerItem = memo(function ITOwnerItem({
  owner,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: ITOwnerItemProps) {
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
        {/* Owner Info */}
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
            {owner.name}
          </Typography>
          {owner.email && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                color: theme.palette.text.secondary,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.5,
              }}
            >
              {owner.email}
            </Typography>
          )}
          {owner.department && (
            <Chip
              label={owner.department}
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
              }}
            />
          )}
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit IT Owner">
            <IconButton
              size="small"
              onClick={() => onEdit(owner)}
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
          <Tooltip title="Delete IT Owner">
            <IconButton
              size="small"
              onClick={() => onDelete(owner.id)}
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

