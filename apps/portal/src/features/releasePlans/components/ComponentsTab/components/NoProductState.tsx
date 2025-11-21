import { Box, Typography } from "@mui/material";

export function NoProductState() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        textAlign: "center",
        p: 3,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 1, fontWeight: 500 }}
        >
          No Product Selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please select a product from the Common Data tab to view its
          components.
        </Typography>
      </Box>
    </Box>
  );
}

