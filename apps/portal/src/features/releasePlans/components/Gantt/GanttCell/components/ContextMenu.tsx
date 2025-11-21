import {
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Link as LinkIcon,
  Flag as MilestoneIcon,
} from "@mui/icons-material";
import { getTimelineColors } from "../../GanttTimeline/constants";
import type { ContextMenuState } from "../hooks/useContextMenu";
import type { CellHandlers } from "../hooks/useCellHandlers";

export type ContextMenuProps = {
  readonly contextMenu: ContextMenuState;
  readonly onClose: () => void;
  readonly handlers: CellHandlers;
  readonly commentsCount: number;
  readonly filesCount: number;
  readonly linksCount: number;
  readonly isMilestone: boolean;
};

export function ContextMenu({
  contextMenu,
  onClose,
  handlers,
  commentsCount,
  filesCount,
  linksCount,
  isMilestone,
}: ContextMenuProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  const anchorPosition =
    contextMenu !== null
      ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
      : undefined;

  return (
    <Menu
      open={contextMenu !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 4px 16px ${alpha(theme.palette.common.black, 0.4)}`
                : `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
            border: `1px solid ${colors.BORDER}`,
          },
        },
      }}
    >
      <MenuItem
        onClick={handlers.handleAddComment}
        sx={{
          py: 1,
          px: 2,
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: alpha(theme.palette.info.main, 0.1),
          },
        }}
      >
        <CommentIcon
          sx={{
            fontSize: 18,
            mr: 1.5,
            color: theme.palette.info.main,
          }}
        />
        <span>Comentarios</span>
        {commentsCount > 0 && (
          <Chip
            label={commentsCount}
            size="small"
            sx={{
              ml: "auto",
              height: 20,
              fontSize: "0.6875rem",
              backgroundColor: alpha(theme.palette.info.main, 0.15),
              color: theme.palette.info.main,
            }}
          />
        )}
      </MenuItem>
      <MenuItem
        onClick={handlers.handleAddFile}
        sx={{
          py: 1,
          px: 2,
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: alpha(theme.palette.success.main, 0.1),
          },
        }}
      >
        <FileIcon
          sx={{
            fontSize: 18,
            mr: 1.5,
            color: theme.palette.success.main,
          }}
        />
        <span>Archivos</span>
        {filesCount > 0 && (
          <Chip
            label={filesCount}
            size="small"
            sx={{
              ml: "auto",
              height: 20,
              fontSize: "0.6875rem",
              backgroundColor: alpha(theme.palette.success.main, 0.15),
              color: theme.palette.success.main,
            }}
          />
        )}
      </MenuItem>
      <MenuItem
        onClick={handlers.handleAddLink}
        sx={{
          py: 1,
          px: 2,
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        <LinkIcon
          sx={{
            fontSize: 18,
            mr: 1.5,
            color: theme.palette.primary.main,
          }}
        />
        <span>Enlaces</span>
        {linksCount > 0 && (
          <Chip
            label={linksCount}
            size="small"
            sx={{
              ml: "auto",
              height: 20,
              fontSize: "0.6875rem",
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
              color: theme.palette.primary.main,
            }}
          />
        )}
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem
        onClick={handlers.handleToggleMilestone}
        sx={{
          py: 1,
          px: 2,
          fontSize: "0.875rem",
          backgroundColor: isMilestone
            ? alpha(theme.palette.warning.main, 0.1)
            : "transparent",
          "&:hover": {
            backgroundColor: alpha(theme.palette.warning.main, 0.15),
          },
        }}
      >
        <MilestoneIcon
          sx={{
            fontSize: 18,
            mr: 1.5,
            color: isMilestone
              ? theme.palette.warning.main
              : theme.palette.text.secondary,
          }}
        />
        <span>{isMilestone ? "Quitar Milestone" : "Marcar como Milestone"}</span>
      </MenuItem>
    </Menu>
  );
}

