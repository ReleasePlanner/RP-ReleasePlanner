import { memo } from "react";
import { Menu, MenuItem, Typography, useTheme, alpha } from "@mui/material";
import { ContentCopy as CopyIcon } from "@mui/icons-material";

export type ReleasePlannerContextMenuProps = {
  readonly open: boolean;
  readonly anchorPosition: { top: number; left: number } | undefined;
  readonly onClose: () => void;
  readonly onCopyPlanId: () => void;
};

/**
 * Component for context menu
 */
export const ReleasePlannerContextMenu = memo(function ReleasePlannerContextMenu({
  open,
  anchorPosition,
  onClose,
  onCopyPlanId,
}: ReleasePlannerContextMenuProps) {
  const theme = useTheme();

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
            mt: 0.5,
          },
        },
      }}
    >
      <MenuItem
        onClick={onCopyPlanId}
        sx={{
          py: 1.5,
          px: 2,
          gap: 1.5,
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <CopyIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Copiar ID del Plan
        </Typography>
      </MenuItem>
    </Menu>
  );
});

