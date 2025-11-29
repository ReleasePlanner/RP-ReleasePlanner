import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export interface AddTalentButtonProps {
  onClick: () => void;
}

export function AddTalentButton({ onClick }: AddTalentButtonProps) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{
        textTransform: "none",
        fontSize: "0.75rem",
        fontWeight: 500,
        px: 2,
        py: 0.75,
        borderRadius: 1.5,
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      }}
    >
      Add Talent
    </Button>
  );
}

