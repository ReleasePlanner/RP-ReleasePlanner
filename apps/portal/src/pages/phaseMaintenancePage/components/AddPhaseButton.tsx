import { memo } from "react";
import { Button } from "@mui/material";

export type AddPhaseButtonProps = {
  readonly onClick: () => void;
};

/**
 * Component for the Add Phase button
 */
export const AddPhaseButton = memo(function AddPhaseButton({
  onClick,
}: AddPhaseButtonProps) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        px: 3,
        py: 1,
        borderRadius: 2,
      }}
    >
      New Phase
    </Button>
  );
});

