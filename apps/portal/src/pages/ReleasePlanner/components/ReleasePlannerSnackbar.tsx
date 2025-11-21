import { memo } from "react";
import { Snackbar, Alert, Typography, useTheme } from "@mui/material";

export type ReleasePlannerSnackbarProps = {
  readonly open: boolean;
  readonly message: string;
  readonly onClose: () => void;
};

/**
 * Component for snackbar notifications
 */
export const ReleasePlannerSnackbar = memo(function ReleasePlannerSnackbar({
  open,
  message,
  onClose,
}: ReleasePlannerSnackbarProps) {
  const theme = useTheme();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        "& .MuiSnackbarContent-root": {
          borderRadius: 2,
          bgcolor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        sx={{
          width: "100%",
          borderRadius: 2,
          "& .MuiAlert-icon": {
            color: theme.palette.success.contrastText,
          },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
});

