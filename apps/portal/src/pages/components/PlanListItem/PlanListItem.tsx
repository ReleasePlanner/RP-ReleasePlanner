import { memo } from "react";
import { Box, Divider } from "@mui/material";
import type {
  Plan as LocalPlan,
  PlanStatus,
} from "@/features/releasePlans/types";
import {
  usePlanListItemState,
  usePlanListItemHandlers,
  usePlanListItemPendingChanges,
  usePlanListItemStyles,
} from "./hooks";
import {
  PlanListItemHeader,
  PlanListItemExpandedContent,
} from "./components";

export type PlanListItemProps = {
  readonly plan: LocalPlan;
  readonly index: number;
  readonly totalPlans: number;
  readonly expanded: boolean;
  readonly onToggle: (planId: string) => void;
  readonly onDelete: (plan: LocalPlan, event: React.MouseEvent) => void;
  readonly onCopyId: (planId: string, event: React.MouseEvent) => void;
  readonly onContextMenu: (event: React.MouseEvent, plan: LocalPlan) => void;
  readonly getStatusChipProps: (status: PlanStatus) => {
    label: string;
    color: "info" | "primary" | "success" | "warning" | "default";
  };
};

/**
 * Memoized component to prevent unnecessary re-renders
 * Applies Separation of Concerns (SoC) by extracting logic into hooks and UI into components
 */
const PlanListItem = memo(function PlanListItem({
  plan,
  index,
  totalPlans,
  expanded,
  onToggle,
  onDelete,
  onCopyId,
  onContextMenu,
  getStatusChipProps,
}: PlanListItemProps) {
  // State management
  const {
    planCardRef,
    isSaving,
    setIsSaving,
    hasPendingChanges,
    setHasPendingChanges,
  } = usePlanListItemState();

  // Event handlers
  const {
    handleToggle,
    handleDelete,
    handleCopyId,
    handleContextMenu,
    handleSave,
  } = usePlanListItemHandlers({
    plan,
    planCardRef,
    setIsSaving,
    onToggle,
    onDelete,
    onCopyId,
    onContextMenu,
  });

  // Track pending changes when expanded
  usePlanListItemPendingChanges({
    expanded,
    planCardRef,
    setHasPendingChanges,
  });

  // Memoized styles
  const {
    headerStyles,
    expandIconStyles,
    expandIconExpandedStyles,
    infoContainerStyles,
    planNameStyles,
    infoStackStyles,
    statusChipStyles,
    infoTextStyles,
    actionsStackStyles,
    getSaveButtonStyles,
    copyButtonStyles,
    deleteButtonStyles,
    dividerStyles,
    expandedContentStyles,
    loadingFallbackStyles,
  } = usePlanListItemStyles();

  return (
    <Box sx={{ width: "100%" }}>
      <PlanListItemHeader
        expanded={expanded}
        onToggle={handleToggle}
        onContextMenu={handleContextMenu}
        headerStyles={headerStyles}
        expandIconStyles={expandIconStyles}
        expandIconExpandedStyles={expandIconExpandedStyles}
        infoContainerStyles={infoContainerStyles}
        planInfoProps={{
          plan,
          getStatusChipProps,
          planNameStyles,
          infoStackStyles,
          statusChipStyles,
          infoTextStyles,
        }}
        actionsProps={{
          expanded,
          isSaving,
          hasPendingChanges,
          onSave: handleSave,
          onCopyId: handleCopyId,
          onDelete: handleDelete,
          actionsStackStyles,
          getSaveButtonStyles,
          copyButtonStyles,
          deleteButtonStyles,
        }}
      />

      {index < totalPlans - 1 && <Divider sx={dividerStyles} />}

      {/* Expanded Content - Lazy loaded for performance */}
      {expanded && (
        <PlanListItemExpandedContent
          plan={plan}
          planCardRef={planCardRef}
          expandedContentStyles={expandedContentStyles}
          loadingFallbackStyles={loadingFallbackStyles}
        />
      )}
    </Box>
  );
});

export default PlanListItem;

