import { memo, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import type { PlanListItemInfoProps } from "./PlanListItemInfo";
import type { PlanListItemActionsProps } from "./PlanListItemActions";
import { PlanListItemInfo } from "./PlanListItemInfo";
import { PlanListItemActions } from "./PlanListItemActions";

export type PlanListItemHeaderProps = {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onContextMenu: (e: React.MouseEvent) => void;
  readonly headerStyles: SxProps<Theme>;
  readonly expandIconStyles: SxProps<Theme>;
  readonly expandIconExpandedStyles: SxProps<Theme>;
  readonly infoContainerStyles: SxProps<Theme>;
  readonly planInfoProps: Omit<
    PlanListItemInfoProps,
    "planNameStyles" | "infoStackStyles" | "statusChipStyles" | "infoTextStyles"
  > & {
    planNameStyles: SxProps<Theme>;
    infoStackStyles: SxProps<Theme>;
    statusChipStyles: SxProps<Theme>;
    infoTextStyles: SxProps<Theme>;
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
  const headerRef = useRef<HTMLDivElement>(null);
  const prefetchedRef = useRef(false);

  // Preload PlanCard module on hover for faster expansion
  useEffect(() => {
    if (!expanded && headerRef.current && !prefetchedRef.current) {
      const handleMouseEnter = () => {
        // Prefetch PlanCard chunk when hovering over the header
        prefetchedRef.current = true;
        import(
          /* webpackChunkName: "plan-card" */
          /* webpackPrefetch: true */
          "../../../../features/releasePlans/components/PlanCard/PlanCard"
        ).catch(() => {
          // Silently fail if prefetch fails
          prefetchedRef.current = false;
        });
      };

      headerRef.current.addEventListener("mouseenter", handleMouseEnter, { once: true });
      return () => {
        if (headerRef.current) {
          headerRef.current.removeEventListener("mouseenter", handleMouseEnter);
        }
      };
    }
  }, [expanded]);

  return (
    <Box ref={headerRef} onContextMenu={onContextMenu} sx={headerStyles}>
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

