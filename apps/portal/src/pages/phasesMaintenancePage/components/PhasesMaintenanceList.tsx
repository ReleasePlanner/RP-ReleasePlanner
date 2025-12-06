import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { BasePhase } from "@/api/services/basePhases.service";
import { PhaseListItem } from "./PhaseListItem";

export type PhasesMaintenanceListProps = {
  readonly phases: BasePhase[];
  readonly onEdit: (phase: BasePhase) => void;
  readonly onDelete: (phase: BasePhase) => void;
  readonly onDuplicate: (phase: BasePhase) => void;
  readonly onMoveUp?: (phase: BasePhase) => void;
  readonly onMoveDown?: (phase: BasePhase) => void;
};

/**
 * Component for the list of phases
 */
export const PhasesMaintenanceList = memo(function PhasesMaintenanceList({
  phases,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: PhasesMaintenanceListProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {phases.map((phase, index) => (
        <PhaseListItem
          key={phase.id}
          phase={phase}
          isLast={index === phases.length - 1}
          isFirst={index === 0}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
    </Paper>
  );
});
