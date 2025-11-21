import { useTheme, alpha } from "@mui/material";

export function HoverOverlay() {
  const theme = useTheme();

  return (
    <div
      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
      style={{
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        pointerEvents: "none",
      }}
    />
  );
}

