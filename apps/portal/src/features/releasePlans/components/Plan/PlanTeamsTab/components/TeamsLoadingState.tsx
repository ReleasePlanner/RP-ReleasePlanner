import { memo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export const TeamsLoadingState = memo(function TeamsLoadingState() {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 1,
        height: "100%",
      }}
    >
      <CircularProgress size={24} />
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.6875rem" }}>
        Loading teams...
      </Typography>
    </Box>
  );
});

