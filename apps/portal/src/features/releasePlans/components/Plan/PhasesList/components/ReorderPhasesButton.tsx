import { memo } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import { DragIndicator, Check } from "@mui/icons-material";
import { TRACK_HEIGHT, LANE_GAP } from "../../../Gantt/constants";
import type { PhasesListStyles } from "../hooks/usePhasesListStyles";

export type ReorderPhasesButtonProps = {
  readonly isReorderMode: boolean;
  readonly onToggleReorderMode: () => void;
  readonly styles: PhasesListStyles;
};

export const ReorderPhasesButton = memo(function ReorderPhasesButton({
  isReorderMode,
  onToggleReorderMode,
  styles,
}: ReorderPhasesButtonProps) {
  return (
    <Tooltip 
      title={isReorderMode ? "Finalizar reordenamiento" : "Reordenar fases"} 
      arrow 
      placement="left"
    >
      <IconButton 
        size="small" 
        onClick={onToggleReorderMode} 
        sx={{
          ...styles.getAddButtonStyles(),
          ...(isReorderMode && {
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }),
        }}
      >
        {isReorderMode ? <Check /> : <DragIndicator />}
      </IconButton>
    </Tooltip>
  );
});

