import { Stack, TextField } from "@mui/material";

export type PlanDateFieldsProps = {
  readonly startDate: string;
  readonly endDate: string;
  readonly error: string | null;
  readonly isSubmitting: boolean;
  readonly onStartDateChange: (value: string) => void;
  readonly onEndDateChange: (value: string) => void;
  readonly onErrorClear: () => void;
};

export function PlanDateFields({
  startDate,
  endDate,
  error,
  isSubmitting,
  onStartDateChange,
  onEndDateChange,
  onErrorClear,
}: PlanDateFieldsProps) {
  return (
    <Stack direction="row" spacing={1.5}>
      <TextField
        id="add-plan-start-date-input"
        name="planStartDate"
        type="date"
        label="Fecha Inicio"
        fullWidth
        required
        value={startDate}
        onChange={(e) => {
          onStartDateChange(e.target.value);
          onErrorClear();
        }}
        variant="outlined"
        size="small"
        slotProps={{
          inputLabel: {
            shrink: true,
            sx: { fontSize: "0.875rem" },
          },
        }}
        disabled={isSubmitting}
        error={!!error && error.toLowerCase().includes("inicio")}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 1.5,
            fontSize: "0.875rem",
          },
        }}
      />
      <TextField
        id="add-plan-end-date-input"
        name="planEndDate"
        type="date"
        label="Fecha Fin"
        fullWidth
        required
        value={endDate}
        onChange={(e) => {
          onEndDateChange(e.target.value);
          onErrorClear();
        }}
        variant="outlined"
        size="small"
        slotProps={{
          inputLabel: {
            shrink: true,
            sx: { fontSize: "0.875rem" },
          },
        }}
        disabled={isSubmitting}
        error={!!error && error.toLowerCase().includes("fin")}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 1.5,
            fontSize: "0.875rem",
          },
        }}
      />
    </Stack>
  );
}

