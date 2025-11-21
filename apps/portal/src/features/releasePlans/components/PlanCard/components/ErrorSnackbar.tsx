import { Snackbar, Alert, Typography } from "@mui/material";

export type ErrorSnackbarProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export function ErrorSnackbar({
  open,
  message,
  onClose,
}: ErrorSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
}

