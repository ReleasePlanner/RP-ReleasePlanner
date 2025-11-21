import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";

export function useComponentCardStyles() {
  const theme = useTheme();

  const card = useMemo(
    () => ({
      borderRadius: 2,
      border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
      transition: theme.transitions.create(["transform", "box-shadow"], {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows[4],
      },
    }),
    [theme]
  );

  return { card };
}

