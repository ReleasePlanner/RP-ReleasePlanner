import { memo } from "react";
import { Box, IconButton } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import type { PlanListItemInfoProps } from "./PlanListItemInfo";
import type { PlanListItemActionsProps } from "./PlanListItemActions";
import { PlanListItemInfo } from "./PlanListItemInfo";
import { PlanListItemActions } from "./PlanListItemActions";

export type PlanListItemHeaderProps = {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onContextMenu: (e: React.MouseEvent) => void;
  readonly headerStyles: Record<string, unknown>;
  readonly expandIconStyles: Record<string, unknown>;
  readonly expandIconExpandedStyles: Record<string, unknown>;
  readonly infoContainerStyles: Record<string, unknown>;
  readonly planInfoProps: Omit<
    PlanListItemInfoProps,
    "planNameStyles" | "infoStackStyles" | "statusChipStyles" | "infoTextStyles"
  > & {
    planNameStyles: Record<string, unknown>;
    infoStackStyles: Record<string, unknown>;
    statusChipStyles: Record<string, unknown>;
    infoTextStyles: Record<string, unknown>;
  };
  readonly actionsProps: PlanListItemActionsProps;
};

/**
 * Component for the plan list item header (expand/collapse, info, actions)
 */
export const PlanListItemHeader = memo(function PlanListItemHeader({
  expanded,
  onToggle,
  onContextMenu,
  headerStyles,
  expandIconStyles,
  expandIconExpandedStyles,
  infoContainerStyles,
  planInfoProps,
  actionsProps,
}: PlanListItemHeaderProps) {
  return (
    <Box onClick={onToggle} onContextMenu={onContextMenu} sx={headerStyles}>
      {/* Expand/Collapse Icon */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        sx={{
          ...expandIconStyles,
          ...(expanded ? expandIconExpandedStyles : {}),
        }}
      >
        <ExpandMore fontSize="inherit" />
      </IconButton>

      {/* Plan Name and Info */}
      <Box sx={infoContainerStyles}>
        <PlanListItemInfo {...planInfoProps} />
      </Box>

      {/* Action Buttons */}
      <PlanListItemActions {...actionsProps} />
    </Box>
  );
});

