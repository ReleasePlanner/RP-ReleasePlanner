import { memo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  useTheme,
  alpha,
  Divider,
  Paper,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import type { Team } from "@/api/services/teams.service";
import type { PlanTeamsStyles } from "../hooks/usePlanTeamsStyles";

export type TeamItemProps = {
  readonly team: Team;
  readonly isLast: boolean;
  readonly onDelete: (id: string) => void;
  readonly styles: PlanTeamsStyles;
};

export const TeamItem = memo(function TeamItem({
  team,
  isLast,
  onDelete,
  styles,
}: TeamItemProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Debug: Log team data to verify talents are being received
  console.log('[TeamItem] Team data:', {
    teamId: team.id,
    teamName: team.name,
    talentsCount: team.talents?.length || 0,
    talents: team.talents,
    hasTalents: !!team.talents,
    talentsIsArray: Array.isArray(team.talents),
  });

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: { xs: 0.75, sm: 1 },
          px: { xs: 1, sm: 1.25 },
          py: { xs: 0.75, sm: 1 },
          transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {/* Expand/Collapse Button */}
        <IconButton
          size="small"
          onClick={handleToggleExpand}
          sx={{
            p: 0.25,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.action.hover, 0.08),
            },
          }}
        >
          {expanded ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </IconButton>

        {/* Team Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.6875rem", sm: "0.75rem" },
                fontWeight: 500,
                color: theme.palette.text.primary,
                flex: 1,
              }}
            >
              {team.name}
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              <Chip
                label={getTypeLabel(team.type)}
                size="small"
                sx={styles.getTypeChipStyles()}
              />
              <Chip
                icon={<PeopleIcon sx={{ fontSize: 12 }} />}
                label={`${team.talents?.length || 0} ${team.talents?.length !== 1 ? "talents" : "talent"}`}
                size="small"
                sx={styles.getTalentsChipStyles()}
              />
            </Stack>
          </Box>

          {team.description && (
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                color: theme.palette.text.secondary,
                display: "block",
                mb: 0.5,
              }}
            >
              {team.description}
            </Typography>
          )}

          {/* Collapsible Talent Details */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 1.5 }}>
              {team.talents && team.talents.length > 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Talents ({team.talents.length})
                  </Typography>
                  <Stack spacing={1}>
                    {team.talents.map((talent, index) => (
                      <Box key={talent.id || index}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.6875rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                              }}
                            >
                              {talent.name}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} flexWrap="wrap">
                              {talent.email && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "0.625rem",
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {talent.email}
                                </Typography>
                              )}
                              {talent.phone && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "0.625rem",
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {talent.phone}
                                </Typography>
                              )}
                              {talent.role && (
                                <Chip
                                  label={talent.role.name}
                                  size="small"
                                  sx={{
                                    height: 16,
                                    fontSize: "0.5625rem",
                                    fontWeight: 500,
                                  }}
                                />
                              )}
                              {talent.allocationPercentage !== undefined && (
                                <Chip
                                  label={`${talent.allocationPercentage}%`}
                                  size="small"
                                  sx={{
                                    height: 16,
                                    fontSize: "0.5625rem",
                                    fontWeight: 500,
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    color: theme.palette.info.main,
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        </Box>
                        {index < team.talents.length - 1 && (
                          <Divider sx={{ mt: 1, borderColor: alpha(theme.palette.divider, 0.08) }} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.625rem",
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  }}
                >
                  No talents assigned to this team.
                </Typography>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Delete Button */}
        <Tooltip title="Delete team" arrow placement="top">
          <IconButton
            size="small"
            onClick={() => onDelete(team.id)}
            sx={styles.getDeleteButtonStyles()}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
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

