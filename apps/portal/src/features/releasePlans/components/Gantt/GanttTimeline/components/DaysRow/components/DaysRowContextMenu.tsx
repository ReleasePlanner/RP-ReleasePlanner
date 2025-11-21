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
  Flag as FlagIcon,
} from "@mui/icons-material";
import { getTimelineColors } from "../../../constants";
import type { PlanReference } from "../../../../../../types";
import type { ContextMenuState } from "../hooks/useDaysRowContextMenu";
import type { DaysRowHandlers } from "../hooks/useDaysRowHandlers";

export type DaysRowContextMenuProps = {
  readonly contextMenu: ContextMenuState;
  readonly onClose: () => void;
  readonly handlers: DaysRowHandlers;
  readonly references: PlanReference[];
};

function getDayReferences(
  references: PlanReference[],
  date: string
): PlanReference[] {
  return references.filter(
    (ref) =>
      (ref.date === date || ref.periodDay === date) && !ref.phaseId
  );
}

function getCommentsCount(dayRefs: PlanReference[]): number {
  return dayRefs.filter((r) => r.type === "note" && !r.url).length;
}

function getFilesCount(dayRefs: PlanReference[]): number {
  return dayRefs.filter(
    (r) => r.type === "document" && r.files && r.files.length > 0
  ).length;
}

function getLinksCount(dayRefs: PlanReference[]): number {
  return dayRefs.filter(
    (r) => r.type === "link" || (r.type === "document" && r.url)
  ).length;
}

function isDayMilestone(references: PlanReference[], date: string): boolean {
  return references.some(
    (ref) =>
      (ref.date === date || ref.periodDay === date) &&
      !ref.phaseId &&
      ref.type === "milestone"
  );
}

export function DaysRowContextMenu({
  contextMenu,
  onClose,
  handlers,
  references,
}: DaysRowContextMenuProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  if (!contextMenu) {
    return null;
  }

  const dayRefs = getDayReferences(references, contextMenu.date);
  const commentsCount = getCommentsCount(dayRefs);
  const filesCount = getFilesCount(dayRefs);
  const linksCount = getLinksCount(dayRefs);
  const isMilestone = isDayMilestone(references, contextMenu.date);

  const anchorPosition = {
    top: contextMenu.mouseY,
    left: contextMenu.mouseX,
  };

  return (
    <Menu
      open={true}
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
        <FlagIcon
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

