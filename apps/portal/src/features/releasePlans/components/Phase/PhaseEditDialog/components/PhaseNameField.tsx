import { TextField } from "@mui/material";

export type PhaseNameFieldProps = {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (value: string) => void;
};

export function PhaseNameField({
  value,
  error,
  onChange,
}: PhaseNameFieldProps) {
  return (
    <TextField
      id="phase-name-input"
      name="phaseName"
      label="Phase Name"
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || " "}
      autoFocus
      sx={{
        "& .MuiInputBase-root": {
          fontSize: "0.875rem",
          letterSpacing: "0.01em",
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.875rem",
          letterSpacing: "0.01em",
        },
      }}
    />
  );
}

