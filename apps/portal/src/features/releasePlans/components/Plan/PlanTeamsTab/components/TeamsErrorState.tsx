import { memo } from "react";
import { Box, Alert } from "@mui/material";

export const TeamsErrorState = memo(function TeamsErrorState() {
  return (
    <Box sx={{ p: 1.5 }}>
      <Alert
        severity="error"
        sx={{
          "& .MuiAlert-message": {
            fontSize: "0.6875rem",
          },
          "& .MuiAlert-icon": {
            fontSize: "1rem",
          },
        }}
      >
        Error loading some teams. Please try again.
      </Alert>
    </Box>
  );
});

