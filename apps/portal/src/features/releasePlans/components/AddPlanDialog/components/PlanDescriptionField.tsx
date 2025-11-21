import { TextField } from "@mui/material";

export type PlanDescriptionFieldProps = {
  readonly description: string;
  readonly isSubmitting: boolean;
  readonly onChange: (value: string) => void;
};

export function PlanDescriptionField({
  description,
  isSubmitting,
  onChange,
}: PlanDescriptionFieldProps) {
  return (
    <TextField
      id="add-plan-description-input"
      name="planDescription"
      label="Descripción"
      fullWidth
      multiline
      rows={3}
      value={description}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Agrega una descripción opcional para este plan de release..."
      variant="outlined"
      size="small"
      disabled={isSubmitting}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 1.5,
          fontSize: "0.875rem",
        },
      }}
    />
  );
}

