import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, useTheme } from "@mui/material";
import { usePhaseReschedules } from "@/api/hooks/usePlans";
import { formatDateLocal } from "../../../../lib/date";

export type PhaseReschedulesTabProps = {
  readonly planId: string;
  readonly phaseId: string;
};

export function PhaseReschedulesTab({
  planId,
  phaseId,
}: PhaseReschedulesTabProps) {
  const theme = useTheme();
  const { data: reschedules = [], isLoading, error } = usePhaseReschedules(planId, phaseId);

  // Debug logging
  console.log('[PhaseReschedulesTab] Props:', { planId, phaseId });
  console.log('[PhaseReschedulesTab] Hook result:', { reschedules, isLoading, error, reschedulesLength: reschedules.length });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress size={24} />
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          color: theme.palette.text.secondary,
          p: 2,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          No reschedules recorded for this phase
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "0.7rem", opacity: 0.7 }}>
          Phase ID: {phaseId}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Original Start</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Original End</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>New Start</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>New End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reschedules.map((reschedule) => (
              <TableRow key={reschedule.id}>
                <TableCell sx={{ fontSize: "0.75rem" }}>
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
                <TableCell sx={{ fontSize: "0.75rem" }}>
                  {reschedule.originalStartDate
                    ? formatDateLocal(reschedule.originalStartDate)
                    : "-"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>
                  {reschedule.originalEndDate
                    ? formatDateLocal(reschedule.originalEndDate)
                    : "-"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", color: theme.palette.primary.main }}>
                  {reschedule.newStartDate
                    ? formatDateLocal(reschedule.newStartDate)
                    : "-"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", color: theme.palette.primary.main }}>
                  {reschedule.newEndDate
                    ? formatDateLocal(reschedule.newEndDate)
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

