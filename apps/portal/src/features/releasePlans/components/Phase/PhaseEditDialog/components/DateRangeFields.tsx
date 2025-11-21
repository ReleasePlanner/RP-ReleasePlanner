import { Box, TextField } from "@mui/material";

export type DateRangeFieldsProps = {
  readonly startDate: string;
  readonly endDate: string;
  readonly dateRangeError?: string;
  readonly onStartDateChange: (value: string) => void;
  readonly onEndDateChange: (value: string) => void;
};

export function DateRangeFields({
  startDate,
  endDate,
  dateRangeError,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFieldsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
      }}
    >
      <TextField
        id="phase-start-date-input"
        name="phaseStartDate"
        label="Start Date"
        type="date"
        size="small"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
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
      <TextField
        id="phase-end-date-input"
        name="phaseEndDate"
        label="End Date"
        type="date"
        size="small"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        error={!!dateRangeError}
        helperText={dateRangeError || " "}
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
    </Box>
  );
}

