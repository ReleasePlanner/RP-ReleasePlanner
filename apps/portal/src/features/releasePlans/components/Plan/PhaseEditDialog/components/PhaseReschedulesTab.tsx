import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, useTheme, Chip } from "@mui/material";
import { formatDateLocal } from "../../../../lib/date";
import { usePhaseReschedulesWithMemory } from "../hooks/usePhaseReschedulesWithMemory";
import type { PlanPhase } from "../../../../types";

export type PhaseReschedulesTabProps = {
  readonly planId: string;
  readonly phaseId: string;
  readonly originalPhase?: PlanPhase | null; // Fase original desde el plan (antes de cambios)
  readonly currentPhase?: PlanPhase | null; // Fase actual desde localMetadata (con cambios pendientes)
};

export function PhaseReschedulesTab({
  planId,
  phaseId,
  originalPhase,
  currentPhase,
}: PhaseReschedulesTabProps) {
  const theme = useTheme();
  const { 
    reschedules, 
    isLoading, 
    error, 
    hasPendingReschedule 
  } = usePhaseReschedulesWithMemory({
    planId,
    phaseId,
    originalPhase,
    currentPhase,
  });

  // Debug logging
  console.log('[PhaseReschedulesTab] Props:', { planId, phaseId, originalPhase, currentPhase });
  console.log('[PhaseReschedulesTab] Hook result:', { 
    reschedules, 
    isLoading, 
    error, 
    reschedulesLength: reschedules.length,
    hasPendingReschedule 
  });

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
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Reschedule Type</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Owner</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Original Start</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Original End</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>New Start</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>New End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reschedules.map((reschedule) => (
              <TableRow 
                key={reschedule.id}
                sx={{
                  backgroundColor: reschedule.isPending ? theme.palette.action.hover : 'transparent',
                  opacity: reschedule.isPending ? 0.8 : 1,
                }}
              >
                <TableCell sx={{ fontSize: "0.75rem" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    {reschedule.isPending && (
                      <Chip
                        label="Pending"
                        size="small"
                        color="warning"
                        sx={{
                          fontSize: "0.65rem",
                          height: 18,
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>
                  {reschedule.rescheduleTypeName ? (
                    <Chip
                      label={reschedule.rescheduleTypeName}
                      size="small"
                      color="secondary"
                      sx={{
                        fontSize: "0.7rem",
                        height: 20,
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>
                  {reschedule.ownerName ? (
                    <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                      {reschedule.ownerName}
                    </Typography>
                  ) : (
                    "-"
                  )}
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

