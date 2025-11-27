import {
  TextField,
  Stack,
  Box,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Typography,
  Divider,
  alpha,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { BaseEditDialog } from "@/components";
import type { Team, TeamType, Talent } from "@/api/services/teams.service";
import { TeamType as TeamTypeEnum } from "@/api/services/teams.service";
import { useRoles } from "@/api/hooks/useRoles";

interface TeamEditDialogProps {
  open: boolean;
  team: Team | null;
  onClose: () => void;
  onSave: () => void;
  onTeamChange: (team: Team) => void;
}

export function TeamEditDialog({
  open,
  team,
  onClose,
  onSave,
  onTeamChange,
}: TeamEditDialogProps) {
  const theme = useTheme();
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const isEditing = team?.id && !team.id.startsWith('team-');

  if (!team) return null;

  // Validate form: team name and all talents must have names
  const isValid = 
    !!team.name?.trim() &&
    (team.talents || []).every((talent) => !!talent.name?.trim()) &&
    (team.talents || []).every((talent) => {
      const allocation = talent.allocationPercentage ?? 100;
      return allocation >= 0 && allocation <= 100;
    });

  const handleAddTalent = () => {
    const newTalent: Talent = {
      id: `talent-${Date.now()}`,
      name: "",
      email: "",
      phone: "",
      roleId: undefined,
      teamId: team.id,
      allocationPercentage: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onTeamChange({
      ...team,
      talents: [...(team.talents || []), newTalent],
    });
  };

  const handleRemoveTalent = (talentId: string) => {
    onTeamChange({
      ...team,
      talents: (team.talents || []).filter((t) => t.id !== talentId),
    });
  };

  const handleTalentChange = (talentId: string, field: keyof Talent, value: string | number) => {
    onTeamChange({
      ...team,
      talents: (team.talents || []).map((t) =>
        t.id === talentId ? { ...t, [field]: value } : t
      ),
    });
  };

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Team" : "New Team"}
      subtitle="Manage team information and talents"
      maxWidth="md"
      fullWidth={true}
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Team"}
      isFormValid={isValid}
    >
      <Stack spacing={3} sx={{ width: "100%", maxHeight: "70vh", overflow: "auto" }}>
        <Box sx={{ pt: 1 }} />
        
        {/* Team Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Team Name"
          placeholder="e.g., Frontend Development Team"
          value={team.name || ""}
          onChange={(e) =>
            onTeamChange({ ...team, name: e.target.value })
          }
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
            },
          }}
        />

        {/* Description */}
        <TextField
          fullWidth
          size="small"
          label="Description"
          placeholder="e.g., Team responsible for frontend development"
          value={team.description || ""}
          onChange={(e) =>
            onTeamChange({ ...team, description: e.target.value })
          }
          multiline
          rows={2}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& textarea": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
            },
          }}
        />

        {/* Team Type */}
        <FormControl fullWidth size="small">
          <InputLabel
            shrink
            sx={{
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            }}
          >
            Team Type
          </InputLabel>
          <Select
            value={team.type || TeamTypeEnum.INTERNAL}
            onChange={(e) =>
              onTeamChange({ ...team, type: e.target.value as TeamType })
            }
            sx={{
              fontSize: "0.6875rem",
              "& .MuiSelect-select": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
            }}
          >
            <MenuItem value={TeamTypeEnum.INTERNAL}>Internal</MenuItem>
            <MenuItem value={TeamTypeEnum.EXTERNAL}>External</MenuItem>
            <MenuItem value={TeamTypeEnum.HYBRID}>Hybrid</MenuItem>
          </Select>
        </FormControl>

        {/* Talents Section */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Talents ({team.talents?.length || 0})
            </Typography>
            <IconButton
              size="small"
              onClick={handleAddTalent}
              sx={{
                fontSize: 16,
                p: 0.5,
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Box>

          {team.talents && team.talents.length > 0 ? (
            <Stack spacing={1.5}>
              {team.talents.map((talent, index) => (
                <Paper
                  key={talent.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Talent {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveTalent(talent.id)}
                      sx={{
                        fontSize: 14,
                        p: 0.25,
                        color: theme.palette.error.main,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                        },
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                  <Stack spacing={1.5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Name"
                      placeholder="e.g., John Doe"
                      value={talent.name || ""}
                      onChange={(e) =>
                        handleTalentChange(talent.id, "name", e.target.value)
                      }
                      required
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          fontSize: "0.625rem",
                          fontWeight: 500,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.6875rem",
                          "& input": {
                            py: 0.5,
                            fontSize: "0.6875rem",
                          },
                        },
                      }}
                    />
                    <Stack direction="row" spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={talent.email || ""}
                        onChange={(e) =>
                          handleTalentChange(talent.id, "email", e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            fontSize: "0.625rem",
                            fontWeight: 500,
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "0.6875rem",
                            "& input": {
                              py: 0.5,
                              fontSize: "0.6875rem",
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Phone"
                        placeholder="+1234567890"
                        value={talent.phone || ""}
                        onChange={(e) =>
                          handleTalentChange(talent.id, "phone", e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            fontSize: "0.625rem",
                            fontWeight: 500,
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "0.6875rem",
                            "& input": {
                              py: 0.5,
                              fontSize: "0.6875rem",
                            },
                          },
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <FormControl fullWidth size="small">
                        <InputLabel
                          shrink
                          sx={{
                            fontSize: "0.625rem",
                            fontWeight: 500,
                            "&.MuiInputLabel-shrink": {
                              backgroundColor: theme.palette.background.paper,
                              paddingLeft: "6px",
                              paddingRight: "6px",
                              zIndex: 1,
                            },
                          }}
                        >
                          Role/Profile
                        </InputLabel>
                        <Select
                          value={talent.roleId || ""}
                          onChange={(e) =>
                            handleTalentChange(talent.id, "roleId", e.target.value || undefined)
                          }
                          displayEmpty
                          disabled={rolesLoading}
                          sx={{
                            fontSize: "0.6875rem",
                            "& .MuiSelect-select": {
                              py: 0.5,
                              fontSize: "0.6875rem",
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        size="small"
                        label="Allocation %"
                        type="number"
                        inputProps={{
                          min: 0,
                          max: 100,
                          step: 0.01,
                        }}
                        placeholder="100"
                        value={talent.allocationPercentage ?? 100}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue === "") {
                            handleTalentChange(talent.id, "allocationPercentage", 100);
                            return;
                          }
                          const value = parseFloat(inputValue);
                          if (!isNaN(value)) {
                            // Clamp value between 0 and 100
                            const clampedValue = Math.max(0, Math.min(100, value));
                            handleTalentChange(talent.id, "allocationPercentage", clampedValue);
                          }
                        }}
                        error={
                          talent.allocationPercentage !== undefined &&
                          (talent.allocationPercentage < 0 || talent.allocationPercentage > 100)
                        }
                        helperText={
                          talent.allocationPercentage !== undefined &&
                          (talent.allocationPercentage < 0 || talent.allocationPercentage > 100)
                            ? "Must be between 0 and 100"
                            : ""
                        }
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            fontSize: "0.625rem",
                            fontWeight: 500,
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "0.6875rem",
                            "& input": {
                              py: 0.5,
                              fontSize: "0.6875rem",
                            },
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                  {index < team.talents.length - 1 && (
                    <Divider sx={{ mt: 1.5, borderColor: alpha(theme.palette.divider, 0.08) }} />
                  )}
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.6875rem",
                  color: theme.palette.text.secondary,
                }}
              >
                No talents added. Click the + button to add talents.
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </BaseEditDialog>
  );
}

