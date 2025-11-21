/**
 * Phase Maintenance Page
 *
 * Minimalist page for managing phases across all release plans
 * Refactored with Separation of Concerns (SoC)
 */

import { Box } from "@mui/material";
import {
  usePhaseMaintenanceState,
  usePhaseMaintenanceHandlers,
} from "./hooks";
import {
  PhaseMaintenanceEmptyState,
  PhaseMaintenanceList,
  AddPhaseButton,
} from "./components";

export function PhaseMaintenancePage() {
  // State management
  const { phases } = usePhaseMaintenanceState();

  // Event handlers
  const { handleAddPhase } = usePhaseMaintenanceHandlers();

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        maxWidth: 900,
        mx: "auto",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <AddPhaseButton onClick={handleAddPhase} />
      </Box>

      {phases.length === 0 ? (
        <PhaseMaintenanceEmptyState />
      ) : (
        <PhaseMaintenanceList phases={phases} />
      )}
    </Box>
  );
}

export default PhaseMaintenancePage;

