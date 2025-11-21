import { TextField } from "@mui/material";

export type PlanNameFieldProps = {
  readonly name: string;
  readonly error: string | null;
  readonly isSubmitting: boolean;
  readonly onChange: (value: string) => void;
  readonly onErrorClear: () => void;
};

export function PlanNameField({
  name,
  error,
  isSubmitting,
  onChange,
  onErrorClear,
}: PlanNameFieldProps) {
  return (
    <TextField
      id="add-plan-name-input"
      name="planName"
      label="Plan Name"
      fullWidth
      required
      value={name}
      onChange={(e) => {
        onChange(e.target.value);
        onErrorClear();
      }}
      placeholder="e.g., Q1 2024 Release, Product Launch 2024"
      variant="outlined"
      size="small"
      autoFocus
      disabled={isSubmitting}
      error={!!error && error.toLowerCase().includes("name")}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 1.5,
          fontSize: "0.875rem",
        },
      }}
    />
  );
}

