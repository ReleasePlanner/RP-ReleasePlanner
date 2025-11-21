import { Box, useTheme, alpha } from "@mui/material";
import type { ComponentConfig } from "@/builders";

export type ComponentIconProps = {
  readonly config: ComponentConfig;
};

function getColorValue(
  theme: ReturnType<typeof useTheme>,
  color: ComponentConfig["color"]
): string {
  switch (color) {
    case "primary":
      return theme.palette.primary.main;
    case "secondary":
      return theme.palette.secondary.main;
    case "success":
      return theme.palette.success.main;
    case "info":
      return theme.palette.info.main;
    case "warning":
      return theme.palette.warning.main;
    default:
      return theme.palette.primary.main;
  }
}

export function ComponentIcon({ config }: ComponentIconProps) {
  const theme = useTheme();
  const colorValue = getColorValue(theme, config.color);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: alpha(colorValue, 0.1),
        color: colorValue,
        mr: 1.5,
      }}
    >
      {config.icon}
    </Box>
  );
}

