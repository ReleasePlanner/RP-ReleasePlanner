import { useState, useCallback } from "react";

export type ContextMenuState = {
  readonly mouseX: number;
  readonly mouseY: number;
} | null;

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  }, [contextMenu]);

  const handleClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    handleContextMenu,
    handleClose,
  };
}

