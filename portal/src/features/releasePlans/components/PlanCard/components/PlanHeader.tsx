import { Typography, IconButton, Chip } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  LOCAL_PLAN_STATUS_LABELS,
  LOCAL_PLAN_STATUS_COLORS,
} from "@/constants";
import type { PlanStatus } from "../../../types";

export type PlanHeaderProps = {
  name: string;
  status: PlanStatus;
  expanded: boolean;
  onToggleExpanded: () => void;
};

/**
 * Header component for PlanCard
 * Displays plan name, status, and expand/collapse control
 */
export function PlanHeader({
  name,
  status,
  expanded,
  onToggleExpanded,
}: PlanHeaderProps) {
  const getStatusColor = (status: PlanStatus) => {
    return LOCAL_PLAN_STATUS_COLORS[status] || "default";
  };

  const getStatusLabel = (status: PlanStatus) => {
    return LOCAL_PLAN_STATUS_LABELS[status] || status;
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Typography variant="h6" className="font-medium">
          {name}
        </Typography>
        <Chip
          label={getStatusLabel(status)}
          color={getStatusColor(status)}
          size="small"
        />
      </div>

      <IconButton
        onClick={onToggleExpanded}
        aria-label={expanded ? "Collapse plan" : "Expand plan"}
        size="small"
      >
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </div>
  );
}
