import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, useTheme, Chip } from "@mui/material";
import { usePlanReschedules } from "@/api/hooks/usePlans";

export type PlanReschedulesTabProps = {
  readonly planId: string;
};

export function PlanReschedulesTab({
  planId,
}: PlanReschedulesTabProps) {
  const theme = useTheme();
  const { data: reschedules = [], isLoading, error } = usePlanReschedules(planId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading reschedules: {error instanceof Error ? error.message : "Unknown error"}
      </Alert>
    );
  }

  if (reschedules.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant="body1">No reschedules recorded for this plan</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 1.5, sm: 2 } }}>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phase</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Original Start</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Original End</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>New Start</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>New End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reschedules.map((reschedule) => (
              <TableRow key={reschedule.id}>
                <TableCell>
                  {(() => {
                    try {
                      const date = new Date(reschedule.rescheduledAt);
                      return new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(date);
                    } catch {
                      return reschedule.rescheduledAt;
                    }
                  })()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={reschedule.phaseName}
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {reschedule.originalStartDate
                    ? (() => {
                        try {
                          const [year, month, day] = reschedule.originalStartDate.split("-").map(Number);
                          const date = new Date(Date.UTC(year, month - 1, day));
                          return new Intl.DateTimeFormat(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(date);
                        } catch {
                          return reschedule.originalStartDate;
                        }
                      })()
                    : "-"}
                </TableCell>
                <TableCell>
                  {reschedule.originalEndDate
                    ? (() => {
                        try {
                          const [year, month, day] = reschedule.originalEndDate.split("-").map(Number);
                          const date = new Date(Date.UTC(year, month - 1, day));
                          return new Intl.DateTimeFormat(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(date);
                        } catch {
                          return reschedule.originalEndDate;
                        }
                      })()
                    : "-"}
                </TableCell>
                <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                  {reschedule.newStartDate
                    ? (() => {
                        try {
                          const [year, month, day] = reschedule.newStartDate.split("-").map(Number);
                          const date = new Date(Date.UTC(year, month - 1, day));
                          return new Intl.DateTimeFormat(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(date);
                        } catch {
                          return reschedule.newStartDate;
                        }
                      })()
                    : "-"}
                </TableCell>
                <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                  {reschedule.newEndDate
                    ? (() => {
                        try {
                          const [year, month, day] = reschedule.newEndDate.split("-").map(Number);
                          const date = new Date(Date.UTC(year, month - 1, day));
                          return new Intl.DateTimeFormat(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(date);
                        } catch {
                          return reschedule.newEndDate;
                        }
                      })()
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

