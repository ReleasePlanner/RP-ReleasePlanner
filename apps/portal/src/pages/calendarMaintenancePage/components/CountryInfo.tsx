import { memo } from "react";
import { Box, Typography, Chip, useTheme, alpha } from "@mui/material";
import type { Calendar } from "@/features/calendar/types";

export type CountryInfoProps = {
  readonly country: {
    id: string;
    name: string;
    code: string;
    region?: string;
  };
  readonly currentCalendar: Calendar | undefined;
};

/**
 * Component for displaying selected country information
 */
export const CountryInfo = memo(function CountryInfo({
  country,
  currentCalendar,
}: CountryInfoProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1.5,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 0.75,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: "0.8125rem",
            color: theme.palette.text.primary,
          }}
        >
          {country.name}
        </Typography>
        <Chip
          label={country.code}
          size="small"
          sx={{
            height: 18,
            fontSize: "0.625rem",
            fontWeight: 500,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            "& .MuiChip-label": {
              px: 0.75,
            },
          }}
        />
      </Box>
      {country.region && (
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.6875rem",
            color: theme.palette.text.secondary,
            display: "block",
            mb: 0.5,
          }}
        >
          Region: {country.region}
        </Typography>
      )}
      {currentCalendar && (
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.6875rem",
            color: theme.palette.text.secondary,
            display: "block",
          }}
        >
          Total days: {currentCalendar.days?.length || 0}
        </Typography>
      )}
    </Box>
  );
});

