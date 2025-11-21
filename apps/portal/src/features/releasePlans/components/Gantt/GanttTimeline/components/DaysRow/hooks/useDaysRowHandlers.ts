import { useCallback } from "react";
import type { ContextMenuState } from "./useDaysRowContextMenu";

export type DaysRowHandlers = {
  readonly handleAddComment: () => void;
  readonly handleAddFile: () => void;
  readonly handleAddLink: () => void;
  readonly handleToggleMilestone: () => void;
};

export function useDaysRowHandlers(
  contextMenu: ContextMenuState,
  handleClose: () => void,
  onAddCellComment?: (date: string) => void,
  onAddCellFile?: (date: string) => void,
  onAddCellLink?: (date: string) => void,
  onToggleCellMilestone?: (date: string) => void
): DaysRowHandlers {
  const handleAddComment = useCallback(() => {
    if (contextMenu && onAddCellComment) {
      onAddCellComment(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onAddCellComment, handleClose]);

  const handleAddFile = useCallback(() => {
    if (contextMenu && onAddCellFile) {
      onAddCellFile(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onAddCellFile, handleClose]);

  const handleAddLink = useCallback(() => {
    if (contextMenu && onAddCellLink) {
      onAddCellLink(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onAddCellLink, handleClose]);

  const handleToggleMilestone = useCallback(() => {
    if (contextMenu && onToggleCellMilestone) {
      onToggleCellMilestone(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onToggleCellMilestone, handleClose]);

  return {
    handleAddComment,
    handleAddFile,
    handleAddLink,
    handleToggleMilestone,
  };
}
