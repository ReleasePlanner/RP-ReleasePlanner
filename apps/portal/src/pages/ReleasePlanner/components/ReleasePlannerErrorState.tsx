import { Alert, Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout } from "@/components";
import AddPlanDialog from "@/features/releasePlans/components/AddPlanDialog";

export type ReleasePlannerErrorStateProps = {
  readonly error: Error | null;
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
 * Component for error state
 */
export function ReleasePlannerErrorState({
  error,
  dialogOpen,
  onDialogClose,
  onDialogSubmit,
  onAddButtonClick,
}: ReleasePlannerErrorStateProps) {
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
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading plans:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </Alert>
      <AddPlanDialog
        open={dialogOpen}
        onClose={onDialogClose}
        onSubmit={onDialogSubmit}
      />
    </PageLayout>
  );
}

