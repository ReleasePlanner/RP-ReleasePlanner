import { memo, useState } from "react";
import { Stack, Tooltip, IconButton, CircularProgress, Chip, useTheme, alpha, Box, Popover, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import type { ReleaseStatus } from "../../../../features/releasePlans/types";

export type PlanListItemActionsProps = {
  readonly expanded: boolean;
  readonly isSaving: boolean;
  readonly hasPendingChanges: boolean;
  readonly releaseStatus?: ReleaseStatus;
  readonly onSave: (e: React.MouseEvent) => void;
  readonly onCopyId: (e: React.MouseEvent) => void;
  readonly onDelete: (e: React.MouseEvent) => void;
  readonly onReleaseStatusChange?: (releaseStatus: ReleaseStatus) => void;
  readonly actionsStackStyles: SxProps<Theme>;
  readonly getSaveButtonStyles: (hasPendingChanges: boolean) => SxProps<Theme>;
  readonly copyButtonStyles: SxProps<Theme>;
  readonly deleteButtonStyles: SxProps<Theme>;
};

/**
 * Component for action buttons (Release Status Tags, Save, Copy ID, Delete)
 */
export const PlanListItemActions = memo(function PlanListItemActions({
  expanded,
  isSaving,
  hasPendingChanges,
  releaseStatus,
  onSave,
  onCopyId,
  onDelete,
  onReleaseStatusChange,
  actionsStackStyles,
  getSaveButtonStyles,
  copyButtonStyles,
  deleteButtonStyles,
}: PlanListItemActionsProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  const releaseStatusOptions: ReleaseStatus[] = [
    "To Be Defined",
    "Success",
    "Rollback",
    "Partial RollBack",
  ];

  const getReleaseStatusColor = (status?: ReleaseStatus) => {
    switch (status) {
      case "Success":
        return theme.palette.success.main;
      case "Rollback":
        return theme.palette.error.main;
      case "Partial RollBack":
        return theme.palette.warning.main;
      case "To Be Defined":
        return theme.palette.text.secondary;
      default:
        return theme.palette.text.secondary;
    }
  };

  const currentStatus: ReleaseStatus = releaseStatus || "To Be Defined";

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (status: ReleaseStatus | "To Be Defined") => {
    // "To Be Defined" is now a valid ReleaseStatus value
    const value = status as ReleaseStatus;
    onReleaseStatusChange?.(value);
    handleClose();
  };

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={actionsStackStyles}>
      {/* Release Status Tags Selector */}
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Chip
          label={currentStatus}
          size="small"
          clickable
          sx={{
            height: 24,
            fontSize: "0.6875rem",
            bgcolor: alpha(getReleaseStatusColor(currentStatus), 0.1),
            color: getReleaseStatusColor(currentStatus),
            border: `1px solid ${alpha(getReleaseStatusColor(currentStatus), 0.3)}`,
            "& .MuiChip-label": {
              px: 1,
            },
            "&:hover": {
              bgcolor: alpha(getReleaseStatusColor(currentStatus), 0.2),
            },
          }}
        />
      </Box>

      {/* Popover with selectable tags */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 1.5, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            Select Release Status:
          </Typography>
          <Stack spacing={0.5}>
            {releaseStatusOptions.map((option: ReleaseStatus) => (
              <Chip
                key={option}
                label={option}
                size="small"
                clickable
                onClick={() => handleStatusSelect(option)}
                sx={{
                  height: 28,
                  fontSize: "0.75rem",
                  bgcolor:
                    currentStatus === option
                      ? alpha(getReleaseStatusColor(option), 0.2)
                      : alpha(getReleaseStatusColor(option), 0.1),
                  color: getReleaseStatusColor(option),
                  border: `1px solid ${alpha(getReleaseStatusColor(option), 0.3)}`,
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                  "&:hover": {
                    bgcolor: alpha(getReleaseStatusColor(option), 0.25),
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Popover>

      {/* Action Buttons */}
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

