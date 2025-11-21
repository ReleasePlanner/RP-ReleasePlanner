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
} from "@mui/icons-material";
import type { BasePhase } from "@/api/services/basePhases.service";

export type PhaseListItemProps = {
  readonly phase: BasePhase;
  readonly isLast: boolean;
  readonly onEdit: (phase: BasePhase) => void;
  readonly onDelete: (phase: BasePhase) => void;
  readonly onDuplicate: (phase: BasePhase) => void;
};

/**
 * Component for a single phase item in the list
 */
export const PhaseListItem = memo(function PhaseListItem({
  phase,
  isLast,
  onEdit,
  onDelete,
  onDuplicate,
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
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25}>
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

