/**
 * Reschedule Type Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing Reschedule Types
 */

import {
  TextField,
  Stack,
  Box,
  useTheme,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
import type { RescheduleType } from "@/api/services/rescheduleTypes.service";

interface RescheduleTypeEditDialogProps {
  open: boolean;
  rescheduleType: RescheduleType;
  onSave: () => void;
  onClose: () => void;
  onChange: (rescheduleType: RescheduleType) => void;
}

export function RescheduleTypeEditDialog({
  open,
  rescheduleType,
  onSave,
  onClose,
  onChange,
}: RescheduleTypeEditDialogProps) {
  const theme = useTheme();
  const isEditing = rescheduleType.id && !rescheduleType.id.startsWith('reschedule-type-');

  const handleChange = (field: keyof RescheduleType, value: string) => {
    onChange({ ...rescheduleType, [field]: value });
  };

  const isValid = rescheduleType.name.trim() !== "";

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Reschedule Type" : "New Reschedule Type"}
      subtitle="Manage reschedule type information"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Reschedule Type"}
      isFormValid={isValid}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Spacer to ensure controls are below header divider */}
        <Box sx={{ pt: 1 }} />
        
        {/* Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Name"
          placeholder="e.g., Delay, Acceleration, Scope Change"
          value={rescheduleType.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.8125rem",
            },
          }}
        />

        {/* Description */}
        <TextField
          fullWidth
          size="small"
          label="Description"
          placeholder="Optional description for this reschedule type"
          value={rescheduleType.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          multiline
          rows={3}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.8125rem",
            },
          }}
        />
      </Stack>
    </BaseEditDialog>
  );
}

