/**
 * PhaseEditDialog Component
 *
 * Minimalist dialog for creating and editing phases
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import type { PlanPhase } from "../../../types";
import { localDateToUTC } from "../../../lib/date";
import { usePhaseForm, usePhaseValidation } from "./hooks";
import {
  PhaseNameField,
  DateRangeFields,
  ColorPicker,
  PhaseEditDialogActions,
} from "./components";

export interface PhaseEditDialogProps {
  readonly open: boolean;
  readonly phase: PlanPhase | null;
  readonly onClose: () => void;
  readonly onSave: (phase: PlanPhase) => void;
}

export function PhaseEditDialog({
  open,
  phase,
  onClose,
  onSave,
}: PhaseEditDialogProps) {
  const theme = useTheme();
  const isNew = !phase?.id || phase.id.startsWith("new-");

  const { formData, setFormData } = usePhaseForm(open, phase);
  const { errors, validate, clearError } = usePhaseValidation();

  const handleSave = () => {
    if (!validate(formData)) return;

    // Convert local dates back to UTC before saving
    const savedPhase: PlanPhase = {
      id: phase?.id || `phase-${Date.now()}`,
      name: formData.name?.trim() || "",
      startDate: formData.startDate
        ? localDateToUTC(formData.startDate)
        : "",
      endDate: formData.endDate ? localDateToUTC(formData.endDate) : "",
      color: formData.color,
    };

    onSave(savedPhase);
    onClose();
  };

  const handleChange = (field: keyof PlanPhase, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear related errors
    if (field === "name") {
      clearError("name");
    }
    if (field === "startDate" || field === "endDate") {
      clearError("dateRange");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: `0 8px 32px ${alpha(
              theme.palette.common.black,
              0.12
            )}`,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 2,
          px: 3,
          fontSize: "1.125rem",
          fontWeight: 600,
          letterSpacing: "0.01em",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {isNew ? "Create New Phase" : "Edit Phase"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <PhaseNameField
            value={formData.name || ""}
            error={errors.name}
            onChange={(value) => handleChange("name", value)}
          />

          <DateRangeFields
            startDate={formData.startDate || ""}
            endDate={formData.endDate || ""}
            dateRangeError={errors.dateRange}
            onStartDateChange={(value) => handleChange("startDate", value)}
            onEndDateChange={(value) => handleChange("endDate", value)}
          />

          <ColorPicker
            value={formData.color || "#185ABD"}
            onChange={(value) => handleChange("color", value)}
          />
        </Box>
      </DialogContent>

      <PhaseEditDialogActions
        isNew={isNew}
        canSave={!!formData.name?.trim()}
        onClose={onClose}
        onSave={handleSave}
      />
    </Dialog>
  );
}

