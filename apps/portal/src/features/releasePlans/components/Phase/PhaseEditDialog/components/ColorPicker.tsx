import { Box, TextField, alpha, useTheme } from "@mui/material";

export type ColorPickerProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 32,
          borderRadius: 1,
          bgcolor: value,
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          flexShrink: 0,
        }}
      />
      <TextField
        id="phase-color-input"
        name="phaseColor"
        label="Color"
        type="color"
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        sx={{
          flex: 1,
          "& .MuiInputBase-root": {
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
          },
          "& input[type='color']": {
            height: 32,
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
}

