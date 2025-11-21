import { Box, Typography, useTheme, alpha } from "@mui/material";

export function EmptyComponentsState() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 100,
        border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
      }}
    >
      <Typography variant="body2" color="text.secondary">
        No components defined for this product.
      </Typography>
    </Box>
  );
}

