import { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  Timeline,
  Assignment,
  Description,
} from "@mui/icons-material";
import type { Plan, PlanStatus } from "@/features/releasePlans/types";
import { getStatusChipProps as getStatusChipPropsUtil } from "@/features/releasePlans/lib/planStatus";
import { formatDateLocal } from "@/features/releasePlans/lib/date";

export type PlanGridCardProps = {
  readonly plan: Plan;
};

/**
 * Compact card component for grid view
 * Displays key information about a plan in a visually appealing card format
 */
export const PlanGridCard = memo(function PlanGridCard({
  plan,
}: PlanGridCardProps) {
  const theme = useTheme();
  const { metadata } = plan;
  const statusChipProps = getStatusChipPropsUtil(metadata.status);

  // Calculate duration in days
  const startDate = new Date(metadata.startDate);
  const endDate = new Date(metadata.endDate);
  const durationDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Count phases and tasks
  const phasesCount = metadata.phases?.length || 0;
  const tasksCount = plan.tasks?.length || 0;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2,
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
        {/* Header: Name and Status */}
        <Box sx={{ mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                lineHeight: 1.3,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                minHeight: "2.6em",
              }}
              title={metadata.name}
            >
              {metadata.name}
            </Typography>
            <Chip
              label={statusChipProps.label}
              color={statusChipProps.color}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 22,
                fontWeight: 500,
                flexShrink: 0,
              }}
            />
          </Box>

          {/* Description */}
          {metadata.description && (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                mb: 1,
              }}
              title={metadata.description}
            >
              {metadata.description}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 1.5, opacity: 0.5 }} />

        {/* Key Information */}
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          {/* Dates */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday
              sx={{
                fontSize: "1rem",
                color: theme.palette.text.secondary,
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  color: theme.palette.text.secondary,
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                {formatDateLocal(metadata.startDate)} -{" "}
                {formatDateLocal(metadata.endDate)}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  color: theme.palette.text.disabled,
                  display: "block",
                  mt: 0.25,
                }}
              >
                {durationDays} {durationDays === 1 ? "day" : "days"}
              </Typography>
            </Box>
          </Box>

          {/* Owner */}
          {metadata.owner && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person
              sx={{
                fontSize: "1rem",
                color: theme.palette.text.secondary,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={metadata.owner}
            >
              {metadata.owner}
            </Typography>
          </Box>
          )}

          {/* Phases */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Timeline
              sx={{
                fontSize: "1rem",
                color: theme.palette.text.secondary,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
              }}
            >
              {phasesCount} {phasesCount === 1 ? "phase" : "phases"}
            </Typography>
          </Box>

          {/* Tasks */}
          {tasksCount > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment
                sx={{
                  fontSize: "1rem",
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {tasksCount} {tasksCount === 1 ? "task" : "tasks"}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Release Status Badge */}
        {metadata.releaseStatus && (
          <>
            <Divider sx={{ my: 1.5, opacity: 0.5 }} />
            <Chip
              label={metadata.releaseStatus}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                alignSelf: "flex-start",
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: theme.palette.text.secondary,
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
});

