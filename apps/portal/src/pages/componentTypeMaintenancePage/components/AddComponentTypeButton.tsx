import { memo } from "react";
import { Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export type AddComponentTypeButtonProps = {
  readonly onClick: () => void;
};

/**
 * Component for the Add Component Type button
 */
export const AddComponentTypeButton = memo(function AddComponentTypeButton({
  onClick,
}: AddComponentTypeButtonProps) {
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
      Add Component Type
    </Button>
  );
});

