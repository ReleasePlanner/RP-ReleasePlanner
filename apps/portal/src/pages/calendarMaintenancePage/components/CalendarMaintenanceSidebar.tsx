import { memo } from "react";
import { Box, Paper, Typography, useTheme, alpha } from "@mui/material";
import type { Calendar } from "@/features/calendar/types";
import { CountrySelector } from "./CountrySelector";
import { CountryInfo } from "./CountryInfo";

export type CalendarMaintenanceSidebarProps = {
  readonly countries: Array<{
    id: string;
    name: string;
    code: string;
    region?: string;
  }>;
  readonly selectedCountryId: string | undefined;
  readonly selectedCountry: { id: string; name: string; code: string; region?: string } | undefined;
  readonly currentCalendar: Calendar | undefined;
  readonly onCountryChange: (countryId: string | undefined) => void;
};

/**
 * Component for the sidebar with country selector and info
 */
export const CalendarMaintenanceSidebar = memo(function CalendarMaintenanceSidebar({
  countries,
  selectedCountryId,
  selectedCountry,
  currentCalendar,
  onCountryChange,
}: CalendarMaintenanceSidebarProps) {
  const theme = useTheme();

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Header */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: "0.8125rem",
                  color: theme.palette.text.primary,
                }}
              >
                Select Country
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6875rem",
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                Choose a country to manage its holidays and special days. The
                calendar will be created automatically when you add the first
                day.
              </Typography>
            </Box>

            {/* Country Selector */}
            <CountrySelector
              countries={countries}
              selectedCountryId={selectedCountryId}
              onCountryChange={onCountryChange}
            />

            {/* Country Info */}
            {selectedCountry && (
              <CountryInfo country={selectedCountry} currentCalendar={currentCalendar} />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
});

