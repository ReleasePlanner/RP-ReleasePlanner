import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";

type AddPhaseDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export default function AddPhaseDialog({
  open,
  onClose,
  onSubmit,
}: AddPhaseDialogProps) {
  const [phaseName, setPhaseName] = useState("");

  const submitPhase = useCallback(() => {
    const name = phaseName.trim();
    if (name) {
      onSubmit(name);
      setPhaseName("");
      onClose();
    }
  }, [onSubmit, phaseName, onClose]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ py: 1.5 }}>Add Phase</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          size="small"
          label="Phase name"
          type="text"
          fullWidth
          variant="outlined"
          value={phaseName}
          onChange={(e) => setPhaseName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitPhase();
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={submitPhase}
          variant="contained"
          disabled={!phaseName.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
