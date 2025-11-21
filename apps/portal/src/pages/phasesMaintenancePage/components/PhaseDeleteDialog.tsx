import { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import type { BasePhase } from "@/api/services/basePhases.service";

export type PhaseDeleteDialogProps = {
  readonly open: boolean;
  readonly phase: BasePhase | null;
  readonly isDeleting: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
};

/**
 * Component for the delete confirmation dialog
 */
export const PhaseDeleteDialog = memo(function PhaseDeleteDialog({
  open,
  phase,
  isDeleting,
  onClose,
  onConfirm,
}: PhaseDeleteDialogProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Typography>
          Are you sure you want to delete the phase{" "}
          <strong>{phase?.name}</strong>?
        </Typography>
        {phase && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: phase.color,
              }}
            />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {phase.name}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isDeleting}
          sx={{ textTransform: "none" }}
        >
          {isDeleting ? (
            <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
          ) : null}
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
});
