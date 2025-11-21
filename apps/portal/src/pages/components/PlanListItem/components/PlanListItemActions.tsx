import { memo } from "react";
import { Stack, Tooltip, IconButton, CircularProgress } from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

export type PlanListItemActionsProps = {
  readonly expanded: boolean;
  readonly isSaving: boolean;
  readonly hasPendingChanges: boolean;
  readonly onSave: (e: React.MouseEvent) => void;
  readonly onCopyId: (e: React.MouseEvent) => void;
  readonly onDelete: (e: React.MouseEvent) => void;
  readonly actionsStackStyles: Record<string, unknown>;
  readonly getSaveButtonStyles: (hasPendingChanges: boolean) => Record<string, unknown>;
  readonly copyButtonStyles: Record<string, unknown>;
  readonly deleteButtonStyles: Record<string, unknown>;
};

/**
 * Component for action buttons (Save, Copy ID, Delete)
 */
export const PlanListItemActions = memo(function PlanListItemActions({
  expanded,
  isSaving,
  hasPendingChanges,
  onSave,
  onCopyId,
  onDelete,
  actionsStackStyles,
  getSaveButtonStyles,
  copyButtonStyles,
  deleteButtonStyles,
}: PlanListItemActionsProps) {
  return (
    <Stack direction="row" spacing={0.25} sx={actionsStackStyles}>
      {expanded && (
        <Tooltip title="Save plan changes">
          <span>
            <IconButton
              size="small"
              onClick={onSave}
              disabled={isSaving || !hasPendingChanges}
              sx={getSaveButtonStyles(hasPendingChanges)}
            >
              {isSaving ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <SaveIcon fontSize="inherit" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}
      <Tooltip title="Copy plan ID">
        <IconButton size="small" onClick={onCopyId} sx={copyButtonStyles}>
          <InfoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete plan">
        <IconButton size="small" onClick={onDelete} sx={deleteButtonStyles}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
});

