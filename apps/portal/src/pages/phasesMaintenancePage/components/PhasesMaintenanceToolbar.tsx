import { memo } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";

export type PhasesMaintenanceToolbarProps = {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly onAddClick: () => void;
};

/**
 * Component for the toolbar with search and add button
 */
export const PhasesMaintenanceToolbar = memo(function PhasesMaintenanceToolbar({
  searchQuery,
  onSearchChange,
  onAddClick,
}: PhasesMaintenanceToolbarProps) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search phases..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick}>
          New Phase
        </Button>
      </Stack>
    </Paper>
  );
});

