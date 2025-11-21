import { useState, useCallback } from "react";

export type ContextMenuState = {
  readonly mouseX: number;
  readonly mouseY: number;
  readonly date: string;
} | null;

export function useDaysRowContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, date: string) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
              date,
            }
          : null
      );
    },
    [contextMenu]
  );

  const handleClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    handleContextMenu,
    handleClose,
  };
}

