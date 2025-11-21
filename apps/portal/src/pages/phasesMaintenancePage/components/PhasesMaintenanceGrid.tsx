import { memo } from "react";
import { Grid } from "@mui/material";
import type { BasePhase } from "@/features/releasePlans/types";
import { PhaseCard } from "./PhaseCard";

export type PhasesMaintenanceGridProps = {
  readonly phases: BasePhase[];
  readonly onEdit: (phase: BasePhase) => void;
  readonly onDelete: (phase: BasePhase) => void;
  readonly onDuplicate: (phase: BasePhase) => void;
};

/**
 * Component for the grid of phase cards
 */
export const PhasesMaintenanceGrid = memo(function PhasesMaintenanceGrid({
  phases,
  onEdit,
  onDelete,
  onDuplicate,
}: PhasesMaintenanceGridProps) {
  return (
    <Grid container spacing={2}>
      {phases.map((phase) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </Grid>
  );
});

