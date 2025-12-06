import { memo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { DragIndicator, Check } from "@mui/icons-material";
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
          color: isReorderMode ? "primary.contrastText" : "primary.main",
          backgroundColor: isReorderMode ? "primary.main" : "transparent",
          border: isReorderMode ? "none" : `1px solid`,
          borderColor: isReorderMode ? "transparent" : "primary.main",
          minWidth: 32,
          minHeight: 32,
          "&:hover": {
            backgroundColor: isReorderMode ? "primary.dark" : "action.hover",
            borderColor: isReorderMode ? "transparent" : "primary.dark",
          },
        }}
        aria-label={
          isReorderMode ? "Finalizar reordenamiento" : "Reordenar fases"
        }
      >
        {isReorderMode ? (
          <Check fontSize="small" />
        ) : (
          <DragIndicator fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
});
