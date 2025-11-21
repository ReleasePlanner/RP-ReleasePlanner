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
} from "@mui/material";
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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingPhase ? "Edit Base Phase" : "New Base Phase"}
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

