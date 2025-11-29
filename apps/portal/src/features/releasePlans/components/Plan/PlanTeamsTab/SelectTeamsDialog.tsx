/**
 * SelectTeamsDialog Component
 * Dialog for selecting teams from maintenance to add to a release plan
 */
import { useState, useMemo } from "react";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckBox,
  CheckBoxOutlineBlank,
  People as PeopleIcon,
} from "@mui/icons-material";
import type { Team } from "@/api/services/teams.service";
import { useTeams } from "@/api/hooks/useTeams";
import { BaseEditDialog } from "@/components/BaseEditDialog";

export type SelectTeamsDialogProps = {
  open: boolean;
  selectedTeamIds: string[];
  onClose: () => void;
  onAddTeams: (teamIds: string[]) => void;
};

export function SelectTeamsDialog({
  open,
  selectedTeamIds,
  onClose,
  onAddTeams,
}: SelectTeamsDialogProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Load teams from API
  const {
    data: allTeams = [],
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams();

  // Debug: Log teams data to verify talents are loaded
  console.log('[SelectTeamsDialog] Teams loaded:', {
    teamsCount: allTeams.length,
    teams: allTeams.map((t: Team) => ({
      id: t.id,
      name: t.name,
      talentsCount: t.talents?.length || 0,
      talents: t.talents,
      hasTalents: !!t.talents,
      talentsIsArray: Array.isArray(t.talents),
    })),
  });

  // Filter out teams already in the plan
  const availableTeams = useMemo(() => {
    return allTeams.filter((t: Team) => !selectedTeamIds.includes(t.id));
  }, [allTeams, selectedTeamIds]);

  // Filter by search query
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return availableTeams;
    const query = searchQuery.toLowerCase();
    return availableTeams.filter(
      (t: Team) =>
        t.name.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        t.type.toLowerCase().includes(query)
    );
  }, [availableTeams, searchQuery]);

  const handleToggleTeam = (teamId: string) => {
    setSelectedIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTeams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeams.map((t: Team) => t.id));
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery("");
    onClose();
  };

  const isAllSelected =
    filteredTeams.length > 0 &&
    selectedIds.length === filteredTeams.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredTeams.length;

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAddTeams(selectedIds);
      setSelectedIds([]);
      setSearchQuery("");
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <BaseEditDialog
      open={open}
      onClose={handleClose}
      editing={false}
      title="Select Teams"
      subtitleChip={selectedIds.length > 0 ? `${selectedIds.length} selected` : undefined}
      maxWidth="lg"
      fullWidth={true}
      onSave={handleAdd}
      saveButtonText={`Add ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`}
      saveButtonDisabled={selectedIds.length === 0}
      isFormValid={selectedIds.length > 0}
      showDefaultActions={true}
      cancelButtonText="Cancel"
    >
      {/* Main Content */}
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}>
        {/* Toolbar */}
        <Stack
          spacing={1}
          sx={{
            pb: 1.5,
            mb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            flexShrink: 0,
          }}
        >
          {/* Search Row */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <TextField
              id="select-teams-search-input"
              name="teamsSearch"
              size="small"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                flex: { xs: "1 1 100%", sm: "0 1 240px" },
                minWidth: 180,
                fontSize: "0.6875rem",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.6875rem",
                },
                "& input": {
                  py: 0.75,
                  fontSize: "0.6875rem",
                },
              }}
            />

            {/* Select All */}
            {filteredTeams.length > 0 && (
              <Button
                size="small"
                onClick={handleSelectAll}
                startIcon={
                  isAllSelected ? <CheckBox sx={{ fontSize: 16 }} /> : <CheckBoxOutlineBlank sx={{ fontSize: 16 }} />
                }
                sx={{
                  textTransform: "none",
                  fontSize: "0.6875rem",
                  px: 1.25,
                  py: 0.5,
                  ml: "auto",
                }}
              >
                {isAllSelected ? "Deselect all" : "Select all"}
              </Button>
            )}
          </Box>
        </Stack>

        {/* Teams Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0, width: "100%" }}>
          {teamsLoading ? (
            <Box
              sx={{
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <CircularProgress size={24} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.6875rem" }}
              >
                Loading teams...
              </Typography>
            </Box>
          ) : teamsError ? (
            <Box sx={{ p: 1.5 }}>
              <Alert
                severity="error"
                sx={{
                  "& .MuiAlert-message": {
                    fontSize: "0.6875rem",
                  },
                  "& .MuiAlert-icon": {
                    fontSize: "1rem",
                  },
                }}
              >
                Error loading teams. Please try again.
              </Alert>
            </Box>
          ) : filteredTeams.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.6875rem" }}>
                {searchQuery
                  ? "No teams found matching search."
                  : "No teams available."}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ width: "100%", maxHeight: "100%" }}>
              <Table
                size="small"
                stickyHeader
                sx={{
                  width: "100%",
                  tableLayout: "auto",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{
                        width: 48,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                      }}
                    >
                      <Checkbox
                        id="select-all-teams-checkbox"
                        name="selectAllTeams"
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                      }}
                    >
                      Team Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                      }}
                    >
                      Talents
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeams.map((team: Team) => {
                    const isSelected = selectedIds.includes(team.id);
                    return (
                      <TableRow
                        key={team.id}
                        hover
                        onClick={() => handleToggleTeam(team.id)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? alpha(theme.palette.primary.main, 0.08)
                            : "transparent",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? alpha(theme.palette.primary.main, 0.12)
                              : alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            id={`team-checkbox-${team.id}`}
                            name={`team-${team.id}`}
                            checked={isSelected}
                            onChange={() => handleToggleTeam(team.id)}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip title={team.name} arrow>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 600 : 400,
                                fontSize: "0.6875rem",
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {team.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={getTypeLabel(team.type)}
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
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip title={team.description || ""} arrow>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.6875rem",
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {team.description || "-"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            icon={<PeopleIcon sx={{ fontSize: 12 }} />}
                            label={`${team.talents?.length || 0} ${team.talents?.length !== 1 ? "talents" : "talent"}`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.625rem",
                              fontWeight: 500,
                              "& .MuiChip-label": {
                                px: 0.75,
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </BaseEditDialog>
  );
}

