import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';

export type PhaseEditDialogProps = {
  open: boolean;
  start: string;
  end: string;
  color: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function PhaseEditDialog({ open, start, end, color, onStartChange, onEndChange, onColorChange, onCancel, onSave }: PhaseEditDialogProps) {
  const isInvalidRange = Boolean(start && end && end < start);
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm" scroll="body" PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ py: 1.5 }}>Edit Phase</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Start"
            size="small"
            type="date"
            value={start}
            onChange={(e) => onStartChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'aria-label': 'Start date' }}
          />
          <TextField
            label="End"
            size="small"
            type="date"
            value={end}
            onChange={(e) => onEndChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'aria-label': 'End date' }}
            error={isInvalidRange}
            helperText={isInvalidRange ? 'End must be after or equal to Start' : ' '}
          />
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' }, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 44, height: 24, borderRadius: 9999, boxShadow: 1, border: '1px solid rgba(0,0,0,0.06)', backgroundColor: color }} aria-label="Color preview" />
            <TextField
              label="Color"
              size="small"
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { padding: 0, height: 32, width: 64, borderRadius: 9999 } }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button onClick={onSave} variant="contained" disabled={isInvalidRange}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
