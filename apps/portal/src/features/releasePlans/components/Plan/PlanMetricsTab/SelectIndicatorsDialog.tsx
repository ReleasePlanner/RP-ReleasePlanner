/**
 * SelectIndicatorsDialog Component
 * Dialog for selecting indicators from maintenance to add to a release plan
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
} from "@mui/icons-material";
import type { Indicator } from "@/api/services/indicators.service";
import { useIndicators } from "@/api/hooks/useIndicators";
import { BaseEditDialog } from "@/components/BaseEditDialog";

export type SelectIndicatorsDialogProps = {
  open: boolean;
  selectedIndicatorIds?: string[]; // IDs of indicators already in the plan
  onClose: () => void;
  onAddIndicators: (indicatorIds: string[]) => void;
};

export function SelectIndicatorsDialog({
  open,
  selectedIndicatorIds,
  onClose,
  onAddIndicators,
}: SelectIndicatorsDialogProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Load indicators from maintenance
  const {
    data: allIndicators = [],
    isLoading: indicatorsLoading,
    error: indicatorsError,
  } = useIndicators();

  // Filter out indicators already in the plan
  // Only show indicators that haven't been registered in the plan
  const availableIndicators = useMemo(() => {
    const safeSelectedIds = selectedIndicatorIds || [];
    return allIndicators.filter(
      (indicator: Indicator) => !safeSelectedIds.includes(indicator.id)
    );
  }, [allIndicators, selectedIndicatorIds]);

  // Filter by search query
  const filteredIndicators = useMemo(() => {
    if (!searchQuery.trim()) return availableIndicators;
    const query = searchQuery.toLowerCase();
    return availableIndicators.filter(
      (indicator: Indicator) =>
        indicator.name.toLowerCase().includes(query) ||
        (indicator.description &&
          indicator.description.toLowerCase().includes(query)) ||
        (indicator.formula &&
          indicator.formula.toLowerCase().includes(query))
    );
  }, [availableIndicators, searchQuery]);

  const handleToggleIndicator = (indicatorId: string) => {
    setSelectedIds((prev) =>
      prev.includes(indicatorId)
        ? prev.filter((id) => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredIndicators.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIndicators.map((indicator: Indicator) => indicator.id));
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery("");
    onClose();
  };

  const isAllSelected =
    filteredIndicators.length > 0 &&
    selectedIds.length === filteredIndicators.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredIndicators.length;

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAddIndicators(selectedIds);
      setSelectedIds([]);
      setSearchQuery("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'archived':
        return theme.palette.text.disabled;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <BaseEditDialog
      open={open}
      onClose={handleClose}
      editing={false}
      title="Select Indicators"
      subtitle="Select indicators from maintenance to add to this plan"
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
              id="select-indicators-search-input"
              name="indicatorsSearch"
              size="small"
              placeholder="Search indicators..."
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
            {filteredIndicators.length > 0 && (
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

        {/* Indicators Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0, width: "100%" }}>
          {indicatorsLoading ? (
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
                Loading indicators...
              </Typography>
            </Box>
          ) : indicatorsError ? (
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
                Error loading indicators. Please try again.
              </Alert>
            </Box>
          ) : filteredIndicators.length === 0 ? (
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
              <Typography
                variant="body2"
                sx={{ fontSize: "0.6875rem" }}
              >
                {searchQuery
                  ? "No indicators found matching search."
                  : "No indicators available."}
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
                        backgroundColor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      <Checkbox
                        id="select-all-indicators-checkbox"
                        name="selectAllIndicators"
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
                        backgroundColor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Indicator
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor: theme.palette.mode === "dark"
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
                        backgroundColor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Formula
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIndicators.map((indicator: Indicator) => {
                    const isSelected = selectedIds.includes(indicator.id);
                    return (
                      <TableRow
                        key={indicator.id}
                        hover
                        onClick={() => handleToggleIndicator(indicator.id)}
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
                            id={`indicator-checkbox-${indicator.id}`}
                            name={`indicator-${indicator.id}`}
                            checked={isSelected}
                            onChange={() => handleToggleIndicator(indicator.id)}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip title={indicator.name} arrow>
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
                              {indicator.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={indicator.status}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.625rem",
                              fontWeight: 500,
                              bgcolor: alpha(getStatusColor(indicator.status), 0.1),
                              color: getStatusColor(indicator.status),
                              textTransform: "capitalize",
                              "& .MuiChip-label": {
                                px: 0.75,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip title={indicator.description || ""} arrow>
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
                              {indicator.description || "-"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          {indicator.formula ? (
                            <Tooltip title={indicator.formula} arrow>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: "0.6875rem",
                                  fontFamily: "monospace",
                                  maxWidth: 200,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {indicator.formula}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.disabled"
                              sx={{ fontSize: "0.6875rem" }}
                            >
                              -
                            </Typography>
                          )}
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

