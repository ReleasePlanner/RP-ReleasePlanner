import { memo } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  UnfoldMore as ExpandIcon,
  UnfoldLess as CollapseIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import type { ViewMode, SortOption, FilterStatus } from "../hooks/useReleasePlannerState";

export type ReleasePlannerToolbarProps = {
  readonly viewMode: ViewMode;
  readonly onViewModeChange: (mode: ViewMode) => void;
  readonly sortBy: SortOption;
  readonly onSortChange: (sort: SortOption) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly statusFilter: FilterStatus;
  readonly onStatusFilterChange: (filter: FilterStatus) => void;
  readonly startDateFilter: string;
  readonly onStartDateFilterChange: (date: string) => void;
  readonly endDateFilter: string;
  readonly onEndDateFilterChange: (date: string) => void;
  readonly onExpandAll: () => void;
  readonly onCollapseAll: () => void;
  readonly onAddPlan: () => void;
  readonly sortOptions: Array<{ value: string; label: string }>;
};

/**
 * Toolbar component for ReleasePlanner with view mode, search, sort, and filters
 */
export const ReleasePlannerToolbar = memo(function ReleasePlannerToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  startDateFilter,
  onStartDateFilterChange,
  endDateFilter,
  onEndDateFilterChange,
  onExpandAll,
  onCollapseAll,
  onAddPlan,
  sortOptions,
}: ReleasePlannerToolbarProps) {
  const theme = useTheme();
  
  // Determine which filter controls to show based on sortBy
  // Filters are always shown when they're relevant to the current sort option
  const showDateFilters = sortBy === "startDate" || sortBy === "endDate";
  const showStatusFilter = sortBy === "status";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        width: "100%",
        flexWrap: { xs: "wrap", md: "nowrap" },
      }}
    >
      {/* View Mode Toggle */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode !== null) onViewModeChange(newMode);
        }}
        aria-label="view mode"
        size="small"
        sx={{
          flexShrink: 0,
          "& .MuiToggleButton-root": {
            px: 1.25,
            py: 0.5,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            color: theme.palette.text.secondary,
            minWidth: 40,
            "&.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            },
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          },
        }}
      >
        <Tooltip title="Vista de cuadrícula" arrow placement="top">
          <ToggleButton value="grid" aria-label="grid view">
            <GridViewIcon fontSize="small" />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Vista de lista" arrow placement="top">
          <ToggleButton value="list" aria-label="list view">
            <ListViewIcon fontSize="small" />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      {/* Search Field */}
      <TextField
        size="small"
        placeholder="Search plans..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  fontSize="small"
                  sx={{ color: theme.palette.text.secondary }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flex: { xs: "1 1 100%", md: "1 1 auto" },
          minWidth: { xs: "100%", md: 280 },
          maxWidth: { xs: "100%", md: 400 },
          order: { xs: 3, md: 0 },
          "& .MuiOutlinedInput-root": {
            height: 32,
            fontSize: "0.8125rem",
            backgroundColor: theme.palette.background.paper,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: 1.5,
            },
          },
        }}
      />

      {/* Sort Dropdown */}
      <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          displayEmpty
          aria-label="Sort by"
          sx={{
            height: 32,
            fontSize: "0.8125rem",
            backgroundColor: theme.palette.background.paper,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.divider, 0.2),
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: 1.5,
            },
          }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Date Filters - Show when sorting by dates */}
      {showDateFilters && (
        <>
          <TextField
            type="date"
            label={sortBy === "startDate" ? "From Start Date" : "From End Date"}
            value={startDateFilter}
            onChange={(e) => onStartDateFilterChange(e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: 180,
              flexShrink: 0,
              "& .MuiOutlinedInput-root": {
                height: 32,
                fontSize: "0.8125rem",
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.divider, 0.2),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 1.5,
              },
            }}
          />
          <TextField
            type="date"
            label={sortBy === "startDate" ? "To Start Date" : "To End Date"}
            value={endDateFilter}
            onChange={(e) => onEndDateFilterChange(e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: 180,
              flexShrink: 0,
              "& .MuiOutlinedInput-root": {
                height: 32,
                fontSize: "0.8125rem",
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.divider, 0.2),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 1.5,
              },
            }}
          />
        </>
      )}

      {/* Status Filter - Show when sorting by status */}
      {showStatusFilter && (
        <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as FilterStatus)}
            displayEmpty
            aria-label="Filter by status"
            sx={{
              height: 32,
              fontSize: "0.8125rem",
              backgroundColor: theme.palette.background.paper,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.divider, 0.2),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 1.5,
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="planned">Planned</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="paused">Paused</MenuItem>
            <MenuItem value="done">Completed</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Action Buttons Group */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexShrink: 0,
          order: { xs: 4, md: 0 },
          ml: { xs: 0, md: "auto" },
        }}
      >
        <Tooltip title="Expand all" arrow placement="top">
          <IconButton
            size="small"
            onClick={onExpandAll}
            sx={{
              width: 32,
              height: 32,
              p: 0.75,
              "&:hover": {
                bgcolor: alpha(theme.palette.action.hover, 0.08),
              },
            }}
          >
            <ExpandIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Collapse all" arrow placement="top">
          <IconButton
            size="small"
            onClick={onCollapseAll}
            sx={{
              width: 32,
              height: 32,
              p: 0.75,
              "&:hover": {
                bgcolor: alpha(theme.palette.action.hover, 0.08),
              },
            }}
          >
            <CollapseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* New Plan Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        onClick={onAddPlan}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.8125rem",
          px: 2,
          py: 0.75,
          height: 32,
          borderRadius: 1.5,
          boxShadow: "none",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          backgroundColor: theme.palette.primary.main,
          flexShrink: 0,
          order: { xs: 2, md: 0 },
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        New Plan
      </Button>
    </Box>
  );
});

