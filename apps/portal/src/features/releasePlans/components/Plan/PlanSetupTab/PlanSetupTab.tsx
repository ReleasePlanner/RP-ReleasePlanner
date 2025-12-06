import { Box, Stack, useTheme, alpha } from "@mui/material";
import { PlanCalendarsTab } from "../PlanCalendarsTab/PlanCalendarsTab";
import { PlanMetricsTab } from "../PlanMetricsTab/PlanMetricsTab";
import { PlanTeamsTab } from "../PlanTeamsTab/PlanTeamsTab";

export type PlanSetupTabProps = {
  readonly calendarIds?: string[];
  readonly indicatorIds?: string[];
  readonly teamIds?: string[];
  readonly onCalendarIdsChange?: (calendarIds: string[]) => void;
  readonly onIndicatorIdsChange?: (indicatorIds: string[]) => void;
  readonly onTeamIdsChange?: (teamIds: string[]) => void;
};

export function PlanSetupTab({
  calendarIds = [],
  indicatorIds = [],
  teamIds = [],
  onCalendarIdsChange,
  onIndicatorIdsChange,
  onTeamIdsChange,
}: PlanSetupTabProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "fit-content",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* Calendars Section */}
        <Box
          sx={{
            flex: "0 0 auto",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PlanCalendarsTab
            calendarIds={calendarIds}
            onCalendarIdsChange={onCalendarIdsChange}
          />
        </Box>

        {/* Metrics Section */}
        <Box
          sx={{
            flex: "0 0 auto",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PlanMetricsTab
            indicatorIds={indicatorIds}
            onIndicatorIdsChange={onIndicatorIdsChange}
          />
        </Box>

        {/* Teams Section */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PlanTeamsTab
            teamIds={teamIds}
            onTeamIdsChange={onTeamIdsChange}
          />
        </Box>
      </Stack>
    </Box>
  );
}

