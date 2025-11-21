import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout } from "@/components";
import AddPlanDialog from "@/features/releasePlans/components/AddPlanDialog";

export type ReleasePlannerEmptyStateProps = {
  readonly dialogOpen: boolean;
  readonly onDialogClose: () => void;
  readonly onDialogSubmit: (
    name: string,
    description: string,
    status: string,
    startDate: string,
    endDate: string,
    productId: string
  ) => Promise<void>;
  readonly onAddButtonClick: () => void;
};

/**
 * Component for empty state when no plans exist
 */
export function ReleasePlannerEmptyState({
  dialogOpen,
  onDialogClose,
  onDialogSubmit,
  onAddButtonClick,
}: ReleasePlannerEmptyStateProps) {
  const theme = useTheme();

  return (
    <PageLayout
      title="Release Planner"
      description="Manage and visualize your release plans"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={onAddButtonClick}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8125rem",
            px: 2,
            py: 0.75,
            height: 32,
            borderRadius: 1.5,
            boxShadow: "none",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          New Plan
        </Button>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          No hay planes de release disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Comienza creando tu primer plan de release
        </Typography>
      </Box>
      <AddPlanDialog
        open={dialogOpen}
        onClose={onDialogClose}
        onSubmit={onDialogSubmit}
      />
    </PageLayout>
  );
}

