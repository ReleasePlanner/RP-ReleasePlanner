import { memo } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import type { BasePhase } from "@/api/services/basePhases.service";

export type PhaseListItemProps = {
  readonly phase: BasePhase;
  readonly isLast: boolean;
  readonly isFirst: boolean;
  readonly onEdit: (phase: BasePhase) => void;
  readonly onDelete: (phase: BasePhase) => void;
  readonly onDuplicate: (phase: BasePhase) => void;
  readonly onMoveUp?: (phase: BasePhase) => void;
  readonly onMoveDown?: (phase: BasePhase) => void;
};

/**
 * Component for a single phase item in the list
 */
export const PhaseListItem = memo(function PhaseListItem({
  phase,
  isLast,
  isFirst,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: PhaseListItemProps) {
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
        {/* Color Indicator */}
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: 1,
            bgcolor: phase.color,
            flexShrink: 0,
            mr: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          }}
        />

        {/* Phase Name */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
                lineHeight: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {phase.name}
            </Typography>
            {phase.isDefault && (
              <Tooltip
                title="Default phase - automatically added to new plans"
                arrow
              >
                <StarIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.warning.main,
                    flexShrink: 0,
                  }}
                />
              </Tooltip>
            )}
          </Stack>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25}>
          {/* Move Up/Down Buttons */}
          {onMoveUp && onMoveDown && (
            <>
              <Tooltip title="Move up" arrow>
                <span>
                  <IconButton
                    size="small"
                    onClick={() => onMoveUp(phase)}
                    disabled={isFirst}
                    sx={{
                      color: theme.palette.text.secondary,
                      p: 0.75,
                      "&:hover:not(:disabled)": {
                        bgcolor: alpha(theme.palette.action.active, 0.1),
                        color: theme.palette.action.active,
                      },
                      "&:disabled": {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <ArrowUpIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move down" arrow>
                <span>
                  <IconButton
                    size="small"
                    onClick={() => onMoveDown(phase)}
                    disabled={isLast}
                    sx={{
                      color: theme.palette.text.secondary,
                      p: 0.75,
                      "&:hover:not(:disabled)": {
                        bgcolor: alpha(theme.palette.action.active, 0.1),
                        color: theme.palette.action.active,
                      },
                      "&:disabled": {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <ArrowDownIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}
          <Tooltip title="Duplicate" arrow>
            <IconButton
              size="small"
              onClick={() => onDuplicate(phase)}
              sx={{
                color: theme.palette.text.secondary,
                p: 0.75,
                "&:hover": {
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                },
              }}
            >
              <DuplicateIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" arrow>
            <IconButton
              size="small"
              onClick={() => onEdit(phase)}
              sx={{
                color: theme.palette.text.secondary,
                p: 0.75,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete(phase)}
              sx={{
                color: theme.palette.text.secondary,
                p: 0.75,
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
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
