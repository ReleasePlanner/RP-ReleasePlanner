import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";

export type PlanMetricsStyles = {
  getAddButtonStyles: () => {
    textTransform: string;
    fontWeight: number;
    fontSize: string;
    px: number;
    py: number;
    borderColor: string;
    color: string;
    "&:hover": {
      borderColor: string;
      backgroundColor: string;
    };
  };
};

export function usePlanMetricsStyles(): PlanMetricsStyles {
  const theme = useTheme();

  return useMemo(
    () => ({
      getAddButtonStyles: () => ({
        textTransform: "none" as const,
        fontWeight: 500,
        fontSize: "0.6875rem",
        px: 1.25,
        py: 0.5,
        borderColor: alpha(theme.palette.primary.main, 0.5),
        color: theme.palette.primary.main,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      }),
    }),
    [theme]
  );
}

