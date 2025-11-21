import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { PlanStatus } from "../../../types";

export type PlanStatusFieldProps = {
  readonly status: PlanStatus;
  readonly isSubmitting: boolean;
  readonly onChange: (status: PlanStatus) => void;
  readonly onErrorClear: () => void;
};

export function PlanStatusField({
  status,
  isSubmitting,
  onChange,
  onErrorClear,
}: PlanStatusFieldProps) {
  return (
    <FormControl fullWidth size="small" required>
      <InputLabel id="status-label" sx={{ fontSize: "0.875rem" }}>
        Status
      </InputLabel>
      <Select
        id="add-plan-status-select"
        name="planStatus"
        labelId="status-label"
        value={status}
        label="Status"
        onChange={(e: SelectChangeEvent) => {
          onChange(e.target.value as PlanStatus);
          onErrorClear();
        }}
        disabled={isSubmitting}
        sx={{
          fontSize: "0.875rem",
          borderRadius: 1.5,
        }}
      >
        <MenuItem value="planned" sx={{ fontSize: "0.875rem" }}>
          Planificado
        </MenuItem>
        <MenuItem value="in_progress" sx={{ fontSize: "0.875rem" }}>
          En Progreso
        </MenuItem>
        <MenuItem value="done" sx={{ fontSize: "0.875rem" }}>
          Completado
        </MenuItem>
        <MenuItem value="paused" sx={{ fontSize: "0.875rem" }}>
          Pausado
        </MenuItem>
      </Select>
    </FormControl>
  );
}

