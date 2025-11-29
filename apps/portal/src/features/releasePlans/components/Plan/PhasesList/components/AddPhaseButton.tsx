import { memo } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { TRACK_HEIGHT, LANE_GAP } from "../../../Gantt/constants";
import type { PhasesListStyles } from "../hooks/usePhasesListStyles";

export type AddPhaseButtonProps = {
  readonly onAdd: () => void;
  readonly styles: PhasesListStyles;
};

export const AddPhaseButton = memo(function AddPhaseButton({
  onAdd,
  styles,
}: AddPhaseButtonProps) {
  return (
    <Tooltip title="Add phase" arrow placement="left">
      <IconButton size="small" onClick={onAdd} sx={styles.getAddButtonStyles()}>
        <AddOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
});

