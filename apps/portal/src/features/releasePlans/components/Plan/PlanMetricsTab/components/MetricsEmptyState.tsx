import { memo } from "react";
import { Box, Typography } from "@mui/material";

export const MetricsEmptyState = memo(function MetricsEmptyState() {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.6875rem" }}>
        No indicators added to this plan. Click "Add" to select indicators from
        maintenance.
      </Typography>
    </Box>
  );
});

