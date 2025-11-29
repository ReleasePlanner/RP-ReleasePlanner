import { memo } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import type { Talent } from "@/api/services/talents.service";

export type TalentItemProps = {
  readonly talent: Talent;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (talent: Talent) => void;
  readonly onDelete: (talentId: string) => void;
};

/**
 * Component for a single talent item in the list
 */
export const TalentItem = memo(function TalentItem({
  talent,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: TalentItemProps) {
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
        {/* Talent Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon
                sx={{
                  fontSize: 16,
                  color: theme.palette.text.secondary,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {talent.name}
              </Typography>
              {talent.role && (
                <Chip
                  label={talent.role.name}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.625rem",
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={2}>
              {talent.email && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EmailIcon
                    sx={{
                      fontSize: 12,
                      color: theme.palette.text.disabled,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.6875rem",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {talent.email}
                  </Typography>
                </Stack>
              )}
              {talent.phone && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PhoneIcon
                    sx={{
                      fontSize: 12,
                      color: theme.palette.text.disabled,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.6875rem",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {talent.phone}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit Talent">
            <IconButton
              size="small"
              onClick={() => onEdit(talent)}
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
          <Tooltip title="Delete Talent">
            <IconButton
              size="small"
              onClick={() => onDelete(talent.id)}
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

