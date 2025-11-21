import { memo } from "react";
import { Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export type AddFeatureButtonProps = {
  readonly onClick: () => void;
  readonly disabled: boolean;
};

/**
 * Component for the Add Feature button
 */
export const AddFeatureButton = memo(function AddFeatureButton({
  onClick,
  disabled,
}: AddFeatureButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<AddIcon sx={{ fontSize: 18 }} />}
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.8125rem",
        px: 2,
        py: 0.75,
        borderRadius: 2,
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
        "&:hover": {
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.32)}`,
        },
        "&:disabled": {
          boxShadow: "none",
        },
      }}
    >
      Add Feature
    </Button>
  );
});

