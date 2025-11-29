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
  Menu,
  Collapse,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, ArrowDropDown as ArrowDropDownIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
import { BaseEditDialog } from "@/components";
import type { Team, TeamType, Talent } from "@/api/services/teams.service";
import { TeamType as TeamTypeEnum } from "@/api/services/teams.service";
import { useRoles } from "@/api/hooks/useRoles";
import { CreateTalentDialog } from "./CreateTalentDialog";
import { SelectTalentDialog } from "./SelectTalentDialog";
import { teamsService } from "@/api/services/teams.service";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TALENTS_QUERY_KEY } from "@/api/hooks/useTalents";
import { useTalents } from "@/api/hooks/useTalents";
import { talentsService } from "@/api/services/talents.service";

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
  const queryClient = useQueryClient();
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const { data: allTalents = [] } = useTalents();
  const isEditing = team?.id && !team.id.startsWith('team-');
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [createTalentDialogOpen, setCreateTalentDialogOpen] = useState(false);
  const [selectTalentDialogOpen, setSelectTalentDialogOpen] = useState(false);
  const [allocationErrors, setAllocationErrors] = useState<{ [talentId: string]: string }>({});
  const [expandedTalents, setExpandedTalents] = useState<Set<string>>(new Set());

  // Check if a talent is existing (not a new one with temporary ID)
  const isExistingTalent = useCallback((talentId: string): boolean => {
    return talentId && !talentId.startsWith('talent-');
  }, []);

  // Handle expand/collapse toggle for talent rows
  const handleToggleExpand = useCallback((talentId: string) => {
    setExpandedTalents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(talentId)) {
        newSet.delete(talentId);
      } else {
        newSet.add(talentId);
      }
      return newSet;
    });
  }, []);

  // Expand all talents by default when team changes
  useEffect(() => {
    if (team?.talents) {
      setExpandedTalents(new Set(team.talents.map((t) => t.id)));
    }
  }, [team?.talents]);

  const handleAddTalentMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchor(event.currentTarget);
  }, []);

  const handleAddTalentMenuClose = useCallback(() => {
    setAddMenuAnchor(null);
  }, []);

  const handleCreateNewTalent = useCallback(() => {
    handleAddTalentMenuClose();
    setCreateTalentDialogOpen(true);
  }, [handleAddTalentMenuClose]);

  const handleSelectExistingTalent = useCallback(() => {
    handleAddTalentMenuClose();
    setSelectTalentDialogOpen(true);
  }, [handleAddTalentMenuClose]);

  const handleCreateTalentAndAssign = useCallback((talentData: {
    name: string;
    email?: string;
    phone?: string;
    roleId?: string;
    allocationPercentage: number;
  }) => {
    if (!team) return;
    // Always add to local state - will be saved when user clicks "Save Changes"
    const role = talentData.roleId ? roles.find((r) => r.id === talentData.roleId) : undefined;
    const newTalent: Talent = {
      id: `talent-${Date.now()}`, // Temporary ID for new talent
      name: talentData.name,
      email: talentData.email,
      phone: talentData.phone,
      roleId: talentData.roleId,
      role: role ? { id: role.id, name: role.name } : undefined,
      teamId: team.id,
      allocationPercentage: talentData.allocationPercentage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onTeamChange({
      ...team,
      talents: [...(team.talents || []), newTalent],
    });
    setCreateTalentDialogOpen(false);
  }, [team, roles, onTeamChange]);

  const handleAddExistingTalents = useCallback((
    talents: Array<{ talentId: string; allocationPercentage: number }>
  ) => {
    if (!team) return;
    if (talents.length === 0) {
      return;
    }

    // Add talents to local state - will be saved when user clicks "Save Changes"
    const newTalents: Talent[] = talents.map((talentData) => {
      const existingTalent = allTalents.find((t) => t.id === talentData.talentId);
      if (!existingTalent) {
        throw new Error(`Talent with ID ${talentData.talentId} not found`);
      }
      return {
        id: existingTalent.id,
        name: existingTalent.name,
        email: existingTalent.email,
        phone: existingTalent.phone,
        roleId: existingTalent.roleId,
        role: existingTalent.role,
        teamId: team.id,
        allocationPercentage: talentData.allocationPercentage,
        createdAt: existingTalent.createdAt,
        updatedAt: existingTalent.updatedAt,
      };
    });

    // Filter out talents that are already in the team
    const existingTalentIds = new Set((team.talents || []).map((t) => t.id));
    const uniqueNewTalents = newTalents.filter((t) => !existingTalentIds.has(t.id));

    if (uniqueNewTalents.length === 0) {
      if (globalThis.alert) {
        globalThis.alert("All selected talents are already in this team.");
      }
      return;
    }

    onTeamChange({
      ...team,
      talents: [...(team.talents || []), ...uniqueNewTalents],
    });
    setSelectTalentDialogOpen(false);
  }, [team, allTalents, onTeamChange]);

  const handleRemoveTalent = useCallback((talentId: string) => {
    if (!team) return;
    
    const talentToRemove = (team.talents || []).find((t) => t.id === talentId);
    if (!talentToRemove) return;

    // Get the allocation percentage of the talent being removed
    const removedAllocation = talentToRemove.allocationPercentage ?? 0;
    
    // Get remaining talents (excluding the one being removed)
    const remainingTalents = (team.talents || []).filter((t) => t.id !== talentId);
    
    // Calculate total allocation of remaining talents
    const totalRemainingAllocation = remainingTalents.reduce(
      (sum, t) => sum + (t.allocationPercentage ?? 0),
      0
    );

    // Redistribute the removed allocation proportionally among remaining talents
    const updatedTalents = remainingTalents.length === 0
      ? []
      : totalRemainingAllocation === 0
      ? remainingTalents.map((talent) => ({
          ...talent,
          allocationPercentage: Math.round((removedAllocation / remainingTalents.length) * 100) / 100,
        }))
      : remainingTalents.map((talent) => {
          const currentAllocation = talent.allocationPercentage ?? 0;
          
          // Calculate proportional share of the removed allocation
          const proportionalShare = (removedAllocation * currentAllocation) / totalRemainingAllocation;

          // Add the proportional share to the current allocation
          const newAllocation = Math.min(100, currentAllocation + proportionalShare);

          return {
            ...talent,
            allocationPercentage: Math.round(newAllocation * 100) / 100, // Round to 2 decimal places
          };
        });

    onTeamChange({
      ...team,
      talents: updatedTalents,
    });
  }, [team, onTeamChange]);

  const handleTalentChange = useCallback(async (
    talentId: string,
    field: keyof Talent,
    value: string | number,
  ) => {
    if (!team) return;
    // If changing allocation percentage for an existing talent, validate total
    if (field === 'allocationPercentage' && isExistingTalent(talentId)) {
      const allocationValue = typeof value === 'number' ? value : parseFloat(String(value));
      
      // Get current allocation from other teams (excluding current team)
      try {
        const excludeTeamId = team.id.startsWith('team-') ? undefined : team.id;
        const totalAllocation = await talentsService.getTotalAllocationPercentage(
          talentId,
          excludeTeamId,
        );
        
        // Get current allocation in this team (if any)
        const currentTalent = team.talents?.find((t) => t.id === talentId);
        const currentAllocation = currentTalent?.allocationPercentage || 0;
        
        // Calculate new total
        const newTotal = totalAllocation - currentAllocation + allocationValue;
        
        if (newTotal > 100) {
          const errorMessage = `Total allocation would exceed 100%. Current: ${totalAllocation.toFixed(2)}%, This team: ${allocationValue.toFixed(2)}%, Total: ${newTotal.toFixed(2)}%`;
          setAllocationErrors((prev) => ({
            ...prev,
            [talentId]: errorMessage,
          }));
          return; // Don't update if validation fails
        } else {
          // Clear error if validation passes
          setAllocationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[talentId];
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Error validating allocation:', error);
        // Allow update but show error
        setAllocationErrors((prev) => ({
          ...prev,
          [talentId]: 'Error validating allocation percentage',
        }));
        return;
      }
    }

    onTeamChange({
      ...team,
      talents: (team.talents || []).map((t) =>
        t.id === talentId ? { ...t, [field]: value } : t
      ),
    });
  }, [team, isExistingTalent, onTeamChange]);

  if (!team) return null;

  // Validate form: team name and all talents must have names
  const isValid = 
    !!team.name?.trim() &&
    (team.talents || []).every((talent) => !!talent.name?.trim()) &&
    (team.talents || []).every((talent) => {
      const allocation = talent.allocationPercentage ?? 100;
      return allocation >= 0 && allocation <= 100;
    });

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
            <Box>
              <IconButton
                size="small"
                onClick={handleAddTalentMenuOpen}
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
                <ArrowDropDownIcon fontSize="inherit" sx={{ ml: -0.5 }} />
              </IconButton>
              <Menu
                anchorEl={addMenuAnchor}
                open={Boolean(addMenuAnchor)}
                onClose={handleAddTalentMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleCreateNewTalent}>
                  Create New Talent
                </MenuItem>
                <MenuItem onClick={handleSelectExistingTalent}>
                  Add Existing Talent
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {team.talents && team.talents.length > 0 ? (
            <Stack spacing={1.5}>
              {team.talents.map((talent, index) => {
                const isExpanded = expandedTalents.has(talent.id);
                return (
                  <Paper
                    key={talent.id || `talent-${index}`}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                      borderRadius: 1,
                    }}
                  >
                    {/* Header - Always visible */}
                    <Box 
                      sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        cursor: "pointer",
                        mb: isExpanded ? 1 : 0,
                      }}
                      onClick={() => handleToggleExpand(talent.id)}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(talent.id);
                          }}
                          sx={{
                            p: 0.25,
                            color: theme.palette.text.secondary,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.action.hover, 0.08),
                            },
                          }}
                        >
                          {isExpanded ? (
                            <ExpandLessIcon fontSize="small" />
                          ) : (
                            <ExpandMoreIcon fontSize="small" />
                          )}
                        </IconButton>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            flex: 1,
                          }}
                        >
                          {talent.name || `Talent ${index + 1}`}
                        </Typography>
                        {talent.allocationPercentage !== undefined && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.6875rem",
                              color: theme.palette.text.secondary,
                              fontWeight: 500,
                            }}
                          >
                            {talent.allocationPercentage}%
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTalent(talent.id);
                        }}
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
                    {/* Collapsible content */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Stack spacing={1.5} sx={{ pt: 1 }}>
                    {(() => {
                      const isExisting = isExistingTalent(talent.id);
                      return (
                        <>
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
                            disabled={isExisting}
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
                              disabled={isExisting}
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
                              disabled={isExisting}
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
                                disabled={rolesLoading || isExisting}
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
                                !!allocationErrors[talent.id] ||
                                (talent.allocationPercentage !== undefined &&
                                  (talent.allocationPercentage < 0 || talent.allocationPercentage > 100))
                              }
                              helperText={
                                allocationErrors[talent.id] ||
                                (talent.allocationPercentage !== undefined &&
                                  (talent.allocationPercentage < 0 || talent.allocationPercentage > 100)
                                  ? "Must be between 0 and 100"
                                  : "")
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
                        </>
                      );
                    })()}
                      </Stack>
                    </Collapse>
                    {index < team.talents.length - 1 && (
                      <Divider sx={{ mt: 1.5, borderColor: alpha(theme.palette.divider, 0.08) }} />
                    )}
                  </Paper>
                );
              })}
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

      {/* Create Talent Dialog */}
      <CreateTalentDialog
        open={createTalentDialogOpen}
        team={team}
        onClose={() => setCreateTalentDialogOpen(false)}
        onSave={handleCreateTalentAndAssign}
      />

      {/* Select Talent Dialog */}
      <SelectTalentDialog
        open={selectTalentDialogOpen}
        team={team}
        onClose={() => setSelectTalentDialogOpen(false)}
        onSave={handleAddExistingTalents}
      />
    </BaseEditDialog>
  );
}

