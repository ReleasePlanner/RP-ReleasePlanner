import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Box,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useTalents } from "@/api/hooks/useTalents";
import type { Team, Talent } from "@/api/services/teams.service";

interface SelectTalentDialogProps {
  open: boolean;
  team: Team | null;
  onClose: () => void;
  onSave: (
    talents: Array<{ talentId: string; allocationPercentage: number }>
  ) => void;
}

interface SelectedTalent {
  talentId: string;
  allocationPercentage: number;
}

export function SelectTalentDialog({
  open,
  team,
  onClose,
  onSave,
}: SelectTalentDialogProps) {
  const theme = useTheme();
  const { data: talents = [], isLoading } = useTalents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTalents, setSelectedTalents] = useState<
    Map<string, SelectedTalent>
  >(new Map());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter out talents that are already in the team
  const availableTalents = useMemo(() => {
    if (!team) return talents;
    const teamTalentIds = new Set(team.talents.map((t) => t.id));
    return talents.filter((talent) => !teamTalentIds.has(talent.id));
  }, [talents, team]);

  // Filter talents by search query
  const filteredTalents = useMemo(() => {
    if (!searchQuery.trim()) return availableTalents;
    const queryLower = searchQuery.toLowerCase();
    return availableTalents.filter(
      (talent) =>
        talent.name.toLowerCase().includes(queryLower) ||
        (talent.email && talent.email.toLowerCase().includes(queryLower)) ||
        (talent.role && talent.role.name.toLowerCase().includes(queryLower))
    );
  }, [availableTalents, searchQuery]);

  const isValid =
    selectedTalents.size > 0 &&
    Array.from(selectedTalents.values()).every(
      (t) => t.allocationPercentage >= 0 && t.allocationPercentage <= 100
    );

  const handleClose = () => {
    setSearchQuery("");
    setSelectedTalents(new Map());
    setErrors({});
    onClose();
  };

  const handleTalentToggle = (talentId: string) => {
    const newSelected = new Map(selectedTalents);
    if (newSelected.has(talentId)) {
      newSelected.delete(talentId);
    } else {
      newSelected.set(talentId, {
        talentId,
        allocationPercentage: 100,
      });
    }
    setSelectedTalents(newSelected);
    // Clear errors when selection changes
    if (errors.talent) {
      setErrors({ ...errors, talent: "" });
    }
  };

  const handleAllocationChange = (
    talentId: string,
    allocationPercentage: number
  ) => {
    const newSelected = new Map(selectedTalents);
    const selected = newSelected.get(talentId);
    if (selected) {
      const clampedValue = Math.max(0, Math.min(100, allocationPercentage));
      newSelected.set(talentId, {
        ...selected,
        allocationPercentage: clampedValue,
      });
      setSelectedTalents(newSelected);
      if (errors[`allocation-${talentId}`]) {
        const newErrors = { ...errors };
        delete newErrors[`allocation-${talentId}`];
        setErrors(newErrors);
      }
    }
  };

  const handleSave = () => {
    if (selectedTalents.size === 0) {
      setErrors({ talent: "Please select at least one talent" });
      return;
    }

    const newErrors: { [key: string]: string } = {};
    const talentsArray = Array.from(selectedTalents.values());

    talentsArray.forEach((talent) => {
      if (talent.allocationPercentage < 0 || talent.allocationPercentage > 100) {
        newErrors[`allocation-${talent.talentId}`] =
          "Allocation must be between 0 and 100";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(talentsArray);
    handleClose();
  };

  const selectedTalentsList = useMemo(() => {
    return Array.from(selectedTalents.values()).map((selected) => {
      const talent = talents.find((t) => t.id === selected.talentId);
      return { ...selected, talent };
    });
  }, [selectedTalents, talents]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          pb: 1,
        }}
      >
        Add Existing Talents ({selectedTalents.size} selected)
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Search"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.875rem",
              },
            }}
          />

          {/* Selected Talents Section */}
          {selectedTalentsList.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                Selected Talents ({selectedTalentsList.length})
              </Typography>
              <Stack spacing={1}>
                {selectedTalentsList.map(({ talent, talentId, allocationPercentage }) => (
                  <Paper
                    key={talentId}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                          }}
                        >
                          {talent?.name || "Unknown"}
                        </Typography>
                        {talent?.email && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.75rem",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {talent.email}
                          </Typography>
                        )}
                      </Box>
                      <TextField
                        size="small"
                        label="Allocation %"
                        type="number"
                        inputProps={{
                          min: 0,
                          max: 100,
                          step: 0.01,
                        }}
                        value={allocationPercentage}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            handleAllocationChange(talentId, value);
                          }
                        }}
                        error={!!errors[`allocation-${talentId}`]}
                        helperText={errors[`allocation-${talentId}`]}
                        sx={{
                          width: 120,
                          "& .MuiOutlinedInput-root": {
                            fontSize: "0.875rem",
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleTalentToggle(talentId)}
                        sx={{
                          color: theme.palette.error.main,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Available Talents List */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                mb: 1,
                color: theme.palette.text.primary,
              }}
            >
              Available Talents
            </Typography>
            <Box
              sx={{
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                borderRadius: 1,
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredTalents.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {availableTalents.length === 0
                      ? "All talents are already assigned to this team"
                      : "No talents found matching your search"}
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {filteredTalents.map((talent) => {
                    const isSelected = selectedTalents.has(talent.id);
                    const selectedData = selectedTalents.get(talent.id);
                    return (
                      <ListItem
                        key={talent.id}
                        disablePadding
                        sx={{
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        }}
                      >
                        <ListItemButton
                          onClick={() => handleTalentToggle(talent.id)}
                          sx={{
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.action.hover,
                                0.04
                              ),
                            },
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleTalentToggle(talent.id)}
                            sx={{
                              p: 0.5,
                              mr: 1,
                            }}
                          />
                          <ListItemText
                            primary={talent.name}
                            secondary={
                              <Stack spacing={0.5} sx={{ mt: 0.5 }} component="div">
                                {talent.email && (
                                  <Typography
                                    variant="caption"
                                    component="div"
                                    sx={{ fontSize: "0.75rem", display: "block" }}
                                  >
                                    {talent.email}
                                  </Typography>
                                )}
                                {talent.role && (
                                  <Typography
                                    variant="caption"
                                    component="div"
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: theme.palette.text.secondary,
                                      display: "block",
                                    }}
                                  >
                                    {talent.role.name}
                                  </Typography>
                                )}
                              </Stack>
                            }
                            primaryTypographyProps={{
                              fontSize: "0.875rem",
                              fontWeight: isSelected ? 600 : 500,
                            }}
                            secondaryTypographyProps={{
                              component: "div",
                            }}
                          />
                          {isSelected && selectedData && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.75rem",
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                ml: 1,
                              }}
                            >
                              {selectedData.allocationPercentage}%
                            </Typography>
                          )}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          </Box>
          {errors.talent && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.error.main,
                fontSize: "0.75rem",
              }}
            >
              {errors.talent}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isValid}
        >
          Add {selectedTalents.size > 0 ? `${selectedTalents.size} ` : ""}Talent{selectedTalents.size > 1 ? "s" : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
