import { DialogActions as MuiDialogActions, Button, alpha, useTheme } from "@mui/material";

export type PhaseEditDialogActionsProps = {
  readonly isNew: boolean;
  readonly canSave: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
};

export function PhaseEditDialogActions({
  isNew,
  canSave,
  onClose,
  onSave,
}: PhaseEditDialogActionsProps) {
  const theme = useTheme();

  return (
    <MuiDialogActions
      sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Button
        onClick={onClose}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          letterSpacing: "0.01em",
          color: theme.palette.text.secondary,
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        variant="contained"
        disabled={!canSave}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "0.01em",
          px: 3,
          boxShadow: "none",
          "&:hover": {
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
          },
        }}
      >
        {isNew ? "Create" : "Save"}
      </Button>
    </MuiDialogActions>
  );
}

