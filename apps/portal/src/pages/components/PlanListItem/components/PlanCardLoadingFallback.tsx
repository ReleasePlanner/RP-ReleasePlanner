import { memo } from "react";
import { Box, LinearProgress, Typography, useTheme, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { Plan } from "../../../../../features/releasePlans/types";
import { usePlanLoadingProgress } from "../hooks/usePlanLoadingProgress";

export type PlanCardLoadingFallbackProps = {
  readonly plan: Plan;
  readonly loadingFallbackStyles: SxProps<Theme>;
};

/**
 * Enhanced loading fallback with real progress tracking
 * Shows actual loading progress based on data loading stages
 */
export const PlanCardLoadingFallback = memo(function PlanCardLoadingFallback({
  plan,
  loadingFallbackStyles,
}: PlanCardLoadingFallbackProps) {
  const theme = useTheme();
  const { progress, stage, isComplete } = usePlanLoadingProgress(plan);

  return (
    <Box
      sx={{
        ...loadingFallbackStyles,
        flexDirection: "column",
        gap: 2,
        px: 3,
        py: 4,
        minHeight: 200,
      }}
    >
      {/* Progress Bar */}
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {stage}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              background: isComplete
                ? `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
                : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              transition: "background 0.3s ease",
            },
          }}
        />
      </Box>

      {/* Loading indicator dots - solo mostrar si no está completo */}
      {!isComplete && (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.main,
                animation: "pulse 1.4s ease-in-out infinite",
                animationDelay: `${index * 0.2}s`,
                "@keyframes pulse": {
                  "0%, 100%": {
                    opacity: 0.3,
                    transform: "scale(0.8)",
                  },
                  "50%": {
                    opacity: 1,
                    transform: "scale(1)",
                  },
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
});

