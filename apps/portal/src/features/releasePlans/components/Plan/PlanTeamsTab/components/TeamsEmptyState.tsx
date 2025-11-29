import { memo } from "react";
import { Box, Typography } from "@mui/material";

export const TeamsEmptyState = memo(function TeamsEmptyState() {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        color: "text.secondary",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.6875rem" }}>
        No teams added to this plan. Click "Add" to select teams from
        maintenance.
      </Typography>
    </Box>
  );
});

