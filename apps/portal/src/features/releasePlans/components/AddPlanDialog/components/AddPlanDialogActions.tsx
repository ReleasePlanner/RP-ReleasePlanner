import {
  DialogActions,
  Button,
  Box,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";

export type AddPlanDialogActionsProps = {
  readonly isFormValid: boolean;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => void;
};

export function AddPlanDialogActions({
  isFormValid,
  isSubmitting,
  onClose,
  onSubmit,
}: AddPlanDialogActionsProps) {
  const theme = useTheme();

  return (
    <DialogActions
      sx={{
        px: 3,
        pt: 2,
        pb: 3,
        gap: 1.5,
      }}
    >
      <Button
        onClick={onClose}
        disabled={isSubmitting}
        sx={{
          textTransform: "none",
          px: 3,
          py: 1,
          borderRadius: 1.5,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          "&:hover": {
            bgcolor: alpha(theme.palette.action.hover, 0.08),
          },
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        disabled={!isFormValid || isSubmitting}
        sx={{
          textTransform: "none",
          px: 3,
          py: 1,
          borderRadius: 1.5,
          fontWeight: 600,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
          "&:hover": {
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            opacity: 0.5,
          },
          transition: "all 0.2s ease-in-out",
          minWidth: 120,
        }}
      >
        {isSubmitting ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} sx={{ color: "inherit" }} />
            <span>Creating...</span>
          </Box>
        ) : (
          "Create Plan"
        )}
      </Button>
    </DialogActions>
  );
}

