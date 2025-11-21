import { memo } from "react";
import { Box } from "@mui/material";
import type { BasePhase } from "@/features/releasePlans/basePhasesSlice";
import { PhaseItem } from "./PhaseItem";

export type PhaseMaintenanceListProps = {
  readonly phases: BasePhase[];
  readonly onEdit?: (phase: BasePhase) => void;
};

/**
 * Component for the list of phases
 */
export const PhaseMaintenanceList = memo(function PhaseMaintenanceList({
  phases,
  onEdit,
}: PhaseMaintenanceListProps) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {phases.map((phase) => (
        <PhaseItem key={phase.id} phase={phase} onEdit={onEdit} />
      ))}
    </Box>
  );
});

