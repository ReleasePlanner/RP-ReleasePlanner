import { memo } from "react";
import { Snackbar, Alert } from "@mui/material";

export type PhasesMaintenanceSnackbarProps = {
  readonly open: boolean;
  readonly message: string;
  readonly severity: "success" | "error";
  readonly onClose: () => void;
};

/**
 * Component for displaying snackbar notifications
 */
export const PhasesMaintenanceSnackbar = memo(
  function PhasesMaintenanceSnackbar({
    open,
    message,
    severity,
    onClose,
  }: PhasesMaintenanceSnackbarProps) {
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
        <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    );
  }
);

