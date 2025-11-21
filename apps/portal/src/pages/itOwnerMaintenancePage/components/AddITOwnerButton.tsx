import { memo } from "react";
import { Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export type AddITOwnerButtonProps = {
  readonly onClick: () => void;
};

/**
 * Component for the Add IT Owner button
 */
export const AddITOwnerButton = memo(function AddITOwnerButton({
  onClick,
}: AddITOwnerButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<AddIcon sx={{ fontSize: 18 }} />}
      onClick={onClick}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.8125rem",
        px: 2,
        py: 0.75,
        boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
        "&:hover": {
          boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
      }}
    >
      Add IT Owner
    </Button>
  );
});

