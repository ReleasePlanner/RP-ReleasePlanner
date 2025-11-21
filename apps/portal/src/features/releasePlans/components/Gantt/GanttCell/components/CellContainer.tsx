import { useCallback } from "react";

export type CellContainerProps = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly onContextMenu: (event: React.MouseEvent) => void;
  readonly children: React.ReactNode;
};

export function CellContainer({
  left,
  top,
  width,
  height,
  onContextMenu,
  children,
}: CellContainerProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Prevent phase bar click when clicking cell
    e.stopPropagation();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Allow phase bars to receive mouse events when dragging
    // Only stop propagation if we're not over a phase bar
    const target = e.target as HTMLElement;
    if (target.closest('[data-testid*="phasebar"]')) {
      return; // Let phase bar handle the event
    }
  }, []);

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left,
        top,
        width,
        height,
        zIndex: 1,
        pointerEvents: "auto",
      }}
      onContextMenu={onContextMenu}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {children}
    </div>
  );
}

