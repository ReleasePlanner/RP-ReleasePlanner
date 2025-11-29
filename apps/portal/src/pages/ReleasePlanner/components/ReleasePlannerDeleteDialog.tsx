import { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Stack,
  Alert,
  Box,
  Typography,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { Person as PersonIcon, CalendarToday as CalendarIcon } from "@mui/icons-material";
import { formatCompactDate } from "@/features/releasePlans/lib/date";
import type { Plan, PlanStatus } from "@/features/releasePlans/types";
import type { StatusChipProps } from "@/features/releasePlans/lib/planStatus";

export type ReleasePlannerDeleteDialogProps = {
  readonly open: boolean;
  readonly planToDelete: Plan | null;
  readonly isPending: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly onResetError: () => void;
  readonly getStatusChipProps: (status: PlanStatus) => StatusChipProps;
};

/**
 * Component for delete confirmation dialog
 */
export const ReleasePlannerDeleteDialog = memo(function ReleasePlannerDeleteDialog({
  open,
  planToDelete,
  isPending,
  isError,
  error,
  onClose,
  onConfirm,
  onResetError,
  getStatusChipProps,
}: ReleasePlannerDeleteDialogProps) {
  const theme = useTheme();

  if (!planToDelete) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isPending}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      {/* Progress Bar */}
      {isPending && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            borderRadius: "3px 3px 0 0",
          }}
        />
      )}

      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          fontWeight: 600,
          fontSize: "1.25rem",
          color: theme.palette.error.main,
        }}
      >
        Delete Release Plan
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
        <Stack spacing={3}>
          {/* Error Alert */}
          {isError && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                "& .MuiAlert-message": {
                  fontSize: "0.875rem",
                },
              }}
              onClose={onResetError}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                Error deleting plan
              </Typography>
              <Typography variant="body2">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred. Please try again."}
              </Typography>
            </Alert>
          )}

          <Alert
            severity="warning"
            sx={{
              borderRadius: 1.5,
              "& .MuiAlert-message": {
                fontSize: "0.875rem",
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              This action cannot be undone
            </Typography>
            <Typography variant="body2">
              The plan and all related data will be permanently deleted
              (phases, tasks, milestones, references, etc.).
            </Typography>
          </Alert>

          {/* Plan Info - Hidden during deletion */}
          {!isPending && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.04),
                border: `1px solid ${alpha(theme.palette.error.main, 0.12)}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: theme.palette.text.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Plan to Delete
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {planToDelete.metadata.name}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  <Chip
                    {...getStatusChipProps(planToDelete.metadata.status)}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    icon={<PersonIcon sx={{ fontSize: 14 }} />}
                    label={planToDelete.metadata.owner}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      borderColor: alpha(theme.palette.divider, 0.3),
                      color: theme.palette.text.secondary,
                    }}
                  />
                  <Chip
                    icon={<CalendarIcon sx={{ fontSize: 14 }} />}
                    label={`${formatCompactDate(
                      planToDelete.metadata.startDate
                    )} - ${formatCompactDate(planToDelete.metadata.endDate)}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      borderColor: alpha(theme.palette.divider, 0.3),
                      color: theme.palette.text.secondary,
                    }}
                  />
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Progress indicator during deletion */}
          {isPending && (
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <CircularProgress
                size={48}
                sx={{
                  color: theme.palette.error.main,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  textAlign: "center",
                }}
              >
                Deleting plan and all related data...
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                }}
              >
                This may take a few moments
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={isPending}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.action.hover, 0.08),
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isPending}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 600,
            bgcolor: theme.palette.error.main,
            boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.3)}`,
            "&:hover": {
              bgcolor: theme.palette.error.dark,
              boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
            transition: "all 0.2s ease-in-out",
            minWidth: 120,
          }}
        >
          {isPending ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} sx={{ color: "inherit" }} />
              <span>Deleting...</span>
            </Box>
          ) : (
            "Delete Plan"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

