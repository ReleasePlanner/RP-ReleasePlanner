import { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { BasePhase } from "@/features/releasePlans/types";

export type PhaseEditDialogProps = {
  readonly open: boolean;
  readonly editingPhase: BasePhase | null;
  readonly formData: Partial<BasePhase>;
  readonly isSaving: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
  readonly onFormDataChange: (data: Partial<BasePhase>) => void;
};

/**
 * Component for the create/edit phase dialog
 */
export const PhaseEditDialog = memo(function PhaseEditDialog({
  open,
  editingPhase,
  formData,
  isSaving,
  onClose,
  onSave,
  onFormDataChange,
}: PhaseEditDialogProps) {
  const theme = useTheme();
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          position: "relative",
        }}
      >
        {editingPhase ? "Edit Base Phase" : "New Base Phase"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: alpha(theme.palette.action.hover, 0.5),
              color: theme.palette.text.primary,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
          />
          <TextField
            label="Color"
            type="color"
            fullWidth
            value={formData.color}
            onChange={(e) =>
              onFormDataChange({ ...formData, color: e.target.value })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!formData.name?.trim() || isSaving}
        >
          {isSaving ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

