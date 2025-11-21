import { useCallback } from "react";

export type CellHandlers = {
  readonly handleAddComment: () => void;
  readonly handleAddFile: () => void;
  readonly handleAddLink: () => void;
  readonly handleToggleMilestone: () => void;
};

export function useCellHandlers(
  handleClose: () => void,
  phaseId: string,
  date: string,
  onAddComment?: (phaseId: string, date: string) => void,
  onAddFile?: (phaseId: string, date: string) => void,
  onAddLink?: (phaseId: string, date: string) => void,
  onToggleMilestone?: (phaseId: string, date: string) => void
): CellHandlers {
  const handleAddComment = useCallback(() => {
    handleClose();
    if (onAddComment) {
      onAddComment(phaseId, date);
    }
  }, [handleClose, onAddComment, phaseId, date]);

  const handleAddFile = useCallback(() => {
    handleClose();
    if (onAddFile) {
      onAddFile(phaseId, date);
    }
  }, [handleClose, onAddFile, phaseId, date]);

  const handleAddLink = useCallback(() => {
    handleClose();
    if (onAddLink) {
      onAddLink(phaseId, date);
    }
  }, [handleClose, onAddLink, phaseId, date]);

  const handleToggleMilestone = useCallback(() => {
    handleClose();
    if (onToggleMilestone) {
      onToggleMilestone(phaseId, date);
    }
  }, [handleClose, onToggleMilestone, phaseId, date]);

  return {
    handleAddComment,
    handleAddFile,
    handleAddLink,
    handleToggleMilestone,
  };
}

