import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  useTheme, 
  Chip, 
  Card, 
  CardContent, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Stack,
  Divider,
  Tooltip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from "@mui/material";
import { 
  InfoOutlined, 
  Close as CloseIcon,
  CalendarToday,
  Person,
  Category,
  Schedule,
  ArrowForward,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import { useState } from "react";
import { usePlanReschedulesWithMemory } from "./hooks/usePlanReschedulesWithMemory";
import { useUpdateReschedule } from "@/api/hooks/usePlans";
import { useRescheduleTypes } from "@/api/hooks/useRescheduleTypes";
import { useITOwners } from "@/api/hooks/useITOwners";
import type { PlanPhase, Plan } from "../../../types";
import type { CombinedReschedule } from "../../PhaseEditDialog/hooks/usePhaseReschedulesWithMemory";

export type PlanReschedulesTabProps = {
  readonly planId: string;
  readonly originalPhases?: PlanPhase[] | null; // Fases originales desde el plan (antes de cambios)
  readonly currentPhases?: PlanPhase[] | null; // Fases actuales desde localMetadata (con cambios pendientes)
};

export function PlanReschedulesTab({
  planId,
  originalPhases,
  currentPhases,
}: PlanReschedulesTabProps) {
  const theme = useTheme();
  const { 
    reschedules, 
    isLoading, 
    error, 
    hasPendingReschedules,
    pendingCount 
  } = usePlanReschedulesWithMemory({
    planId,
    originalPhases,
    currentPhases,
  });

  // Debug logging
  console.log('[PlanReschedulesTab] Props:', { planId, originalPhases, currentPhases });
  console.log('[PlanReschedulesTab] Hook result:', { 
    reschedules, 
    isLoading, 
    error, 
    reschedulesLength: reschedules.length,
    hasPendingReschedules,
    pendingCount 
  });

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
      {hasPendingReschedules && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'warning.light', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${pendingCount} Pending`}
            size="small"
            color="warning"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            {pendingCount} reschedule{pendingCount !== 1 ? 's' : ''} pending to be saved
          </Typography>
        </Box>
      )}
      
      <Stack spacing={2}>
        {reschedules.map((reschedule) => (
          <RescheduleCard 
            key={reschedule.id} 
            reschedule={reschedule} 
            theme={theme}
            planId={planId}
          />
        ))}
      </Stack>
    </Box>
  );
}

// Componente para formatear fechas de forma compacta
function formatDateCompact(dateStr: string | undefined | null): string {
  if (!dateStr) return "-";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateStr;
  }
}

// Componente de tarjeta compacta para cada reschedule
function RescheduleCard({ 
  reschedule, 
  theme,
  planId
}: { 
  reschedule: CombinedReschedule; 
  theme: any;
  planId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRescheduleTypeId, setEditedRescheduleTypeId] = useState<string | undefined>(reschedule.rescheduleTypeId);
  const [editedOwnerId, setEditedOwnerId] = useState<string | undefined>(reschedule.ownerId);
  
  // Cargar reschedule types desde la lista de mantenimiento
  const { data: rescheduleTypes = [], isLoading: isLoadingRescheduleTypes } = useRescheduleTypes();
  const { data: owners = [], isLoading: isLoadingOwners } = useITOwners();
  const updateRescheduleMutation = useUpdateReschedule(planId);
  
  const hasStartChange = reschedule.originalStartDate !== reschedule.newStartDate;
  const hasEndChange = reschedule.originalEndDate !== reschedule.newEndDate;
  const hasAnyChange = hasStartChange || hasEndChange;
  
  // Solo permitir edición si no es pending (los pending aún no están guardados)
  const canEdit = !reschedule.isPending && reschedule.id && !reschedule.id.startsWith('pending-');
  
  const handleSave = async () => {
    if (!canEdit || !reschedule.id) return;
    
    try {
      await updateRescheduleMutation.mutateAsync({
        rescheduleId: reschedule.id,
        data: {
          rescheduleTypeId: editedRescheduleTypeId,
          ownerId: editedOwnerId,
        },
      });
      setIsEditing(false);
      setOpen(false);
    } catch (error) {
      console.error('Error updating reschedule:', error);
    }
  };
  
  const handleCancel = () => {
    setEditedRescheduleTypeId(reschedule.rescheduleTypeId);
    setEditedOwnerId(reschedule.ownerId);
    setIsEditing(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme.shadows[4],
            transform: "translateY(-2px)",
          },
          borderLeft: reschedule.isPending 
            ? `4px solid ${theme.palette.warning.main}` 
            : `4px solid ${theme.palette.primary.main}`,
          opacity: reschedule.isPending ? 0.9 : 1,
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
            {/* Información principal */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
                <Chip
                  label={reschedule.phaseName}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                />
                {reschedule.isPending && (
                  <Chip
                    label="Pending"
                    size="small"
                    color="warning"
                    sx={{
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
                {reschedule.rescheduleTypeName && (
                  <Chip
                    label={reschedule.rescheduleTypeName}
                    size="small"
                    color="secondary"
                    sx={{
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
              </Box>

              {/* Fechas compactas */}
              {hasAnyChange && (
                <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1 }}>
                  {hasStartChange && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                        Start:
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          textDecoration: "line-through", 
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          mr: 0.5
                        }}
                      >
                        {formatDateCompact(reschedule.originalStartDate)}
                      </Typography>
                      <ArrowForward sx={{ fontSize: 12, color: "text.secondary" }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.primary.main, 
                          fontWeight: 600,
                          fontSize: "0.75rem"
                        }}
                      >
                        {formatDateCompact(reschedule.newStartDate)}
                      </Typography>
                    </Box>
                  )}
                  {hasEndChange && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                        End:
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          textDecoration: "line-through", 
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          mr: 0.5
                        }}
                      >
                        {formatDateCompact(reschedule.originalEndDate)}
                      </Typography>
                      <ArrowForward sx={{ fontSize: 12, color: "text.secondary" }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.primary.main, 
                          fontWeight: 600,
                          fontSize: "0.75rem"
                        }}
                      >
                        {formatDateCompact(reschedule.newEndDate)}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}

              {/* Información secundaria */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                  {formatDateTime(reschedule.rescheduledAt)}
                </Typography>
                {reschedule.ownerName && (
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                    {reschedule.ownerName}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Botón para ver más detalles */}
            <Tooltip title="View details">
              <IconButton
                size="small"
                onClick={() => setOpen(true)}
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.light + "20",
                  },
                }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog con detalles completos */}
      <Dialog 
        open={open} 
        onClose={() => {
          handleCancel();
          setOpen(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Reschedule Details
          <IconButton
            size="small"
            onClick={() => {
              handleCancel();
              setOpen(false);
            }}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Phase */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Category fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Phase
                </Typography>
              </Box>
              <Chip label={reschedule.phaseName} size="small" />
            </Box>

            <Divider />

            {/* Date & Time */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Schedule fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Rescheduled At
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {formatDateTime(reschedule.rescheduledAt)}
              </Typography>
            </Box>

            {/* Dates Comparison */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <CalendarToday fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Date Changes
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {(hasStartChange || reschedule.originalStartDate || reschedule.newStartDate) && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                      Start Date
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          textDecoration: hasStartChange ? "line-through" : "none",
                          color: hasStartChange ? "text.secondary" : "text.primary"
                        }}
                      >
                        {formatDateCompact(reschedule.originalStartDate) || "Not set"}
                      </Typography>
                      {hasStartChange && (
                        <>
                          <ArrowForward sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.primary.main, 
                              fontWeight: 600 
                            }}
                          >
                            {formatDateCompact(reschedule.newStartDate) || "Not set"}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                )}
                {(hasEndChange || reschedule.originalEndDate || reschedule.newEndDate) && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                      End Date
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          textDecoration: hasEndChange ? "line-through" : "none",
                          color: hasEndChange ? "text.secondary" : "text.primary"
                        }}
                      >
                        {formatDateCompact(reschedule.originalEndDate) || "Not set"}
                      </Typography>
                      {hasEndChange && (
                        <>
                          <ArrowForward sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.primary.main, 
                              fontWeight: 600 
                            }}
                          >
                            {formatDateCompact(reschedule.newEndDate) || "Not set"}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Reschedule Type - Editable */}
            <>
              <Divider />
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Category fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Reschedule Type
                    </Typography>
                  </Box>
                  {canEdit && !isEditing && (
                    <IconButton
                      size="small"
                      onClick={() => setIsEditing(true)}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {isEditing ? (
                  <FormControl fullWidth size="small" disabled={isLoadingRescheduleTypes}>
                    <InputLabel id={`reschedule-type-label-${reschedule.id}`}>
                      Reschedule Type
                    </InputLabel>
                    <Select
                      labelId={`reschedule-type-label-${reschedule.id}`}
                      value={editedRescheduleTypeId || ""}
                      onChange={(e) => setEditedRescheduleTypeId(e.target.value || undefined)}
                      displayEmpty
                      label="Reschedule Type"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {rescheduleTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {isLoadingRescheduleTypes && (
                      <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>
                        Loading reschedule types...
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  reschedule.rescheduleTypeName ? (
                    <Chip 
                      label={reschedule.rescheduleTypeName} 
                      size="small" 
                      color="secondary"
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                      Not set
                    </Typography>
                  )
                )}
              </Box>
            </>

            {/* Owner - Editable */}
            <>
              <Divider />
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Owner
                    </Typography>
                  </Box>
                </Box>
                {isEditing ? (
                  <FormControl fullWidth size="small" disabled={isLoadingOwners}>
                    <InputLabel id={`owner-label-${reschedule.id}`}>
                      Owner
                    </InputLabel>
                    <Select
                      labelId={`owner-label-${reschedule.id}`}
                      value={editedOwnerId || ""}
                      onChange={(e) => setEditedOwnerId(e.target.value || undefined)}
                      displayEmpty
                      label="Owner"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {owners.map((owner) => (
                        <MenuItem key={owner.id} value={owner.id}>
                          {owner.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {isLoadingOwners && (
                      <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>
                        Loading owners...
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  reschedule.ownerName ? (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {reschedule.ownerName}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                      Not set
                    </Typography>
                  )
                )}
              </Box>
            </>

            {/* Status */}
            {reschedule.isPending && (
              <>
                <Divider />
                <Box>
                  <Chip
                    label="Pending - Not yet saved"
                    size="small"
                    color="warning"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button 
                onClick={handleCancel}
                disabled={updateRescheduleMutation.isPending}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                variant="contained"
                disabled={updateRescheduleMutation.isPending}
                startIcon={<SaveIcon />}
              >
                {updateRescheduleMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setOpen(false)}>Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

