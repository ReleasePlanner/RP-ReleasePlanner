import { useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import type { Plan as LocalPlan, PlanStatus } from "@/features/releasePlans/types";
import type { BasePhase } from "@/api/services/basePhases.service";
import type { ViewMode, SortOption, FilterStatus } from "./useReleasePlannerState";
import type { AppDispatch } from "@/store/hooks";
import { setPlanExpanded } from "@/store/store";
import { getStatusChipProps as getStatusChipPropsUtil } from "@/features/releasePlans/lib/planStatus";

interface UseReleasePlannerHandlersProps {
  dialogOpen: boolean;
  deleteDialogOpen: boolean;
  planToDelete: LocalPlan | null;
  contextMenu: { mouseX: number; mouseY: number } | null;
  planForContextMenu: LocalPlan | null;
  snackbar: { open: boolean; message: string };
  viewMode: ViewMode;
  sortBy: SortOption;
  searchQuery: string;
  statusFilter: FilterStatus;
  setDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setPlanToDelete: (plan: LocalPlan | null) => void;
  setContextMenu: (menu: { mouseX: number; mouseY: number } | null) => void;
  setPlanForContextMenu: (plan: LocalPlan | null) => void;
  setSnackbar: (snackbar: { open: boolean; message: string }) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortOption) => void;
    setSearchQuery: (query: string) => void;
    setStatusFilter: (filter: FilterStatus) => void;
  plans: LocalPlan[];
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
  createMutation: {
    mutateAsync: (data: {
      name: string;
      startDate: string;
      endDate: string;
      status: PlanStatus;
      productId: string;
      description?: string;
      phases?: Array<{ name: string; color: string; startDate: string; endDate: string; sequence?: number }>;
    }) => Promise<unknown>;
  };
  basePhases: BasePhase[];
  dispatch: AppDispatch;
}

/**
 * Hook for managing ReleasePlanner event handlers
 */
export function useReleasePlannerHandlers({
  dialogOpen,
  deleteDialogOpen,
  planToDelete,
  contextMenu,
  planForContextMenu,
  snackbar,
  viewMode,
  sortBy,
    searchQuery,
    statusFilter,
    setDialogOpen,
  setDeleteDialogOpen,
  setPlanToDelete,
  setContextMenu,
  setPlanForContextMenu,
  setSnackbar,
  setViewMode,
  setSortBy,
    setSearchQuery,
    setStatusFilter,
    plans,
  deleteMutation,
  createMutation,
  basePhases,
  dispatch,
}: UseReleasePlannerHandlersProps) {
  // Get expanded states from Redux (source of truth)
  const expandedStates = useAppSelector((s) => s.ui.planExpandedByPlanId ?? {});
  
  const handleAddButtonClick = useCallback(() => setDialogOpen(true), [setDialogOpen]);
  
  const handleDialogClose = useCallback(() => setDialogOpen(false), [setDialogOpen]);
  
  const handleDeleteClick = useCallback(
    (plan: LocalPlan, event: React.MouseEvent) => {
      event.stopPropagation();
      setPlanToDelete(plan);
      setDeleteDialogOpen(true);
    },
    [setPlanToDelete, setDeleteDialogOpen]
  );
  
  const handleDeleteConfirm = useCallback(async () => {
    if (!planToDelete || deleteMutation.isPending) return;
    
    try {
      await deleteMutation.mutateAsync(planToDelete.id);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    } catch (error: unknown) {
      console.error("Error deleting plan:", error);
    }
  }, [planToDelete, deleteMutation, setDeleteDialogOpen, setPlanToDelete]);
  
  const handleDeleteCancel = useCallback(() => {
    if (deleteMutation.isPending) return;
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  }, [deleteMutation.isPending, setDeleteDialogOpen, setPlanToDelete]);
  
  const handleContextMenu = useCallback(
    (event: React.MouseEvent, plan: LocalPlan) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null
      );
      setPlanForContextMenu(plan);
    },
    [contextMenu, setContextMenu, setPlanForContextMenu]
  );
  
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
    setPlanForContextMenu(null);
  }, [setContextMenu, setPlanForContextMenu]);
  
  const handleCopyPlanId = useCallback(async () => {
    if (!planForContextMenu) return;
    
    try {
      await navigator.clipboard.writeText(planForContextMenu.id);
      setSnackbar({
        open: true,
        message: `ID del plan copiado: ${planForContextMenu.id}`,
      });
      handleCloseContextMenu();
    } catch (error: unknown) {
      console.error("Error copying to clipboard:", error);
      setSnackbar({
        open: true,
        message: "Error copying plan ID",
      });
    }
  }, [planForContextMenu, setSnackbar, handleCloseContextMenu]);
  
  const handleCopyPlanIdDirect = useCallback(
    async (planId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      
      try {
        await navigator.clipboard.writeText(planId);
        setSnackbar({
          open: true,
          message: `Plan ID copied: ${planId}`,
        });
      } catch (error: unknown) {
        console.error("Error copying to clipboard:", error);
        setSnackbar({
          open: true,
          message: "Error copying plan ID",
        });
      }
    },
    [setSnackbar]
  );
  
  const handleDialogSubmit = useCallback(
    async (
      name: string,
      description: string,
      status: string,
      startDate: string,
      endDate: string,
      productId: string
    ) => {
      let phases: Array<{ name: string; color: string; startDate: string; endDate: string; sequence?: number }> | undefined;
      
      // ⚡ CRITICAL: Filter only phases marked as default
      const defaultPhases = basePhases.filter((bp) => bp.isDefault === true);
      
      if (defaultPhases.length > 0) {
        const planStart = new Date(startDate);
        const planEnd = new Date(endDate);
        
        // ⚡ CRITICAL: Each default phase has 1 day duration
        const phaseDurationDays = 1;
        
        // ⚡ CRITICAL: Calculate sequential dates - each phase starts where the previous one ends
        phases = [];
        let currentStart = new Date(planStart);
        
        for (let index = 0; index < defaultPhases.length; index++) {
          const bp = defaultPhases[index];
          const phaseStart = new Date(currentStart);
          
          // Each phase lasts 1 day
          const phaseEnd = new Date(phaseStart);
          phaseEnd.setDate(phaseEnd.getDate() + phaseDurationDays);
          
          // Ensure last phase doesn't exceed plan end date
          const finalEndDate = phaseEnd.getTime() > planEnd.getTime()
            ? planEnd
            : phaseEnd;
          
          phases.push({
            name: bp.name,
            color: bp.color,
            startDate: phaseStart.toISOString().slice(0, 10),
            endDate: finalEndDate.toISOString().slice(0, 10),
            sequence: index + 1, // Sequential order (1, 2, 3, etc.)
          });
          
          // Next phase starts the day after this phase ends
          currentStart = new Date(finalEndDate);
          currentStart.setDate(currentStart.getDate() + 1);
        }
      }
      
      await createMutation.mutateAsync({
        name,
        startDate,
        endDate,
        status: status as PlanStatus,
        productId,
        description,
        phases,
      });
      setDialogOpen(false);
    },
    [basePhases, createMutation, setDialogOpen]
  );
  
  const handleExpandAll = useCallback(() => {
    for (const p of plans) {
      dispatch(setPlanExpanded({ planId: p.id, expanded: true }));
    }
  }, [plans, dispatch]);
  
  const handleCollapseAll = useCallback(() => {
    for (const p of plans) {
      dispatch(setPlanExpanded({ planId: p.id, expanded: false }));
    }
  }, [plans, dispatch]);
  
  const handlePlanToggle = useCallback(
    (planId: string) => {
      // Get current state from Redux to toggle (source of truth)
      const currentExpanded = expandedStates[planId] ?? false;
      const newExpanded = !currentExpanded;
      
      // Update Redux state directly (source of truth)
      // Redux updates are synchronous and fast, no need for local state duplication
      dispatch(setPlanExpanded({ planId, expanded: newExpanded }));
    },
    [expandedStates, dispatch]
  );
  
  // Use utility function directly - no need for useCallback since it's a pure function
  // This ensures the function reference is stable and doesn't cause re-renders
  const getStatusChipProps = getStatusChipPropsUtil;

  return {
    handleAddButtonClick,
    handleDialogClose,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleContextMenu,
    handleCloseContextMenu,
    handleCopyPlanId,
    handleCopyPlanIdDirect,
    handleDialogSubmit,
    handleExpandAll,
    handleCollapseAll,
    handlePlanToggle,
    getStatusChipProps,
  };
}

