import { Alert, Typography } from "@mui/material";

export type ErrorAlertProps = {
  readonly error: string | null;
  readonly onClose: () => void;
};

export function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert
      severity="error"
      sx={{
        borderRadius: 1.5,
        "& .MuiAlert-message": {
          fontSize: "0.875rem",
        },
      }}
      onClose={onClose}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
        Error creating plan
      </Typography>
      <Typography variant="body2">{error}</Typography>
    </Alert>
  );
}

