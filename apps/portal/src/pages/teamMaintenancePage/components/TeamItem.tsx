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
import { Edit as EditIcon, Delete as DeleteIcon, People as PeopleIcon } from "@mui/icons-material";
import type { Team, TeamType } from "@/api/services/teams.service";

export type TeamItemProps = {
  readonly team: Team;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (team: Team) => void;
  readonly onDelete: (teamId: string) => void;
};

/**
 * Component for a single team item in the list
 */
export const TeamItem = memo(function TeamItem({
  team,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: TeamItemProps) {
  const theme = useTheme();

  const getTypeColor = (type: TeamType) => {
    switch (type) {
      case 'internal':
        return theme.palette.info.main;
      case 'external':
        return theme.palette.warning.main;
      case 'hybrid':
        return theme.palette.success.main;
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
        {/* Team Info */}
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
            {team.name}
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} alignItems="center">
            <Chip
              label={team.type}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.625rem",
                fontWeight: 500,
                bgcolor: alpha(getTypeColor(team.type), 0.1),
                color: getTypeColor(team.type),
                "& .MuiChip-label": {
                  px: 0.75,
                  textTransform: "capitalize",
                },
              }}
            />
            <Chip
              icon={<PeopleIcon sx={{ fontSize: 12 }} />}
              label={`${team.talents.length} talent${team.talents.length !== 1 ? 's' : ''}`}
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
          </Stack>
          {team.description && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                color: theme.palette.text.secondary,
                mt: 0.5,
                display: "block",
                maxWidth: "400px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {team.description}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit Team">
            <IconButton
              size="small"
              onClick={() => onEdit(team)}
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
          <Tooltip title="Delete Team">
            <IconButton
              size="small"
              onClick={() => onDelete(team.id)}
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

