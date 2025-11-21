import { useCallback } from "react";
import type { Plan as LocalPlan, PlanStatus } from "@/features/releasePlans/types";
import type { BasePhase } from "@/api/services/basePhases.service";
import type { ViewMode, SortOption, FilterStatus } from "./useReleasePlannerState";
import type { AppDispatch } from "@/store/hooks";
import { setPlanExpanded } from "@/store/store";

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
  showFilters: boolean;
  localExpandedStates: Record<string, boolean>;
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
  setShowFilters: (show: boolean) => void;
  setLocalExpandedStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
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
      phases?: Array<{ name: string; color: string; startDate: string; endDate: string }>;
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
  showFilters,
  localExpandedStates,
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
  setShowFilters,
  setLocalExpandedStates,
  plans,
  deleteMutation,
  createMutation,
  basePhases,
  dispatch,
}: UseReleasePlannerHandlersProps) {
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
      let phases: Array<{ name: string; color: string; startDate: string; endDate: string }> | undefined;
      
      if (basePhases.length > 0) {
        const planStart = new Date(startDate);
        
        phases = basePhases.map((bp) => {
          const phaseStart = new Date(planStart);
          const phaseEnd = new Date(phaseStart);
          phaseEnd.setDate(phaseEnd.getDate() + 7);
          
          return {
            name: bp.name,
            color: bp.color,
            startDate: phaseStart.toISOString().slice(0, 10),
            endDate: phaseEnd.toISOString().slice(0, 10),
          };
        });
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
      setLocalExpandedStates((prev) => {
        const newExpanded = !prev[planId];
        
        if (typeof globalThis.window !== "undefined" && "requestIdleCallback" in globalThis.window) {
          globalThis.requestIdleCallback(() => {
            dispatch(setPlanExpanded({ planId, expanded: newExpanded }));
          });
        } else {
          setTimeout(() => {
            dispatch(setPlanExpanded({ planId, expanded: newExpanded }));
          }, 0);
        }
        
        return {
          ...prev,
          [planId]: newExpanded,
        };
      });
    },
    [setLocalExpandedStates, dispatch]
  );
  
  const getStatusChipProps = useCallback((status: PlanStatus) => {
    switch (status) {
      case "planned":
        return {
          label: "Planned",
          color: "info" as const,
        };
      case "in_progress":
        return {
          label: "In Progress",
          color: "primary" as const,
        };
      case "done":
        return {
          label: "Completed",
          color: "success" as const,
        };
      case "paused":
        return {
          label: "Paused",
          color: "warning" as const,
        };
      default:
        return { label: status, color: "default" as const };
    }
  }, []);

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

