import { DialogTitle, useTheme, alpha } from "@mui/material";

export function AddPlanDialogTitle() {
  const theme = useTheme();

  return (
    <DialogTitle
      sx={{
        px: 3,
        pt: 3,
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        fontWeight: 600,
        fontSize: "1.25rem",
        color: theme.palette.text.primary,
      }}
    >
      New Release Plan
    </DialogTitle>
  );
}

