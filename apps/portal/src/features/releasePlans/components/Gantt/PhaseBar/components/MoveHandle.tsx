export type MoveHandleProps = {
  readonly isDragging: boolean;
  readonly testIdSuffix?: string;
  readonly onMouseDown: (
    e: React.MouseEvent<HTMLElement>,
    handler?: (e: React.MouseEvent<HTMLElement>) => void
  ) => void;
  readonly onStartMove?: (e: React.MouseEvent<HTMLElement>) => void;
  readonly onDoubleClick: (e: React.MouseEvent<HTMLElement>) => void;
};

export function MoveHandle({
  isDragging,
  testIdSuffix,
  onMouseDown,
  onStartMove,
  onDoubleClick,
}: MoveHandleProps) {
  return (
    <button
      type="button"
      role="button"
      aria-label="Drag to move phase"
      data-testid={testIdSuffix ? `phasebar-move-${testIdSuffix}` : undefined}
      className="absolute"
      style={{
        left: 8,
        right: 8,
        top: 0,
        height: "100%",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: 11,
        userSelect: "none",
        pointerEvents: "auto",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        border: "none",
        padding: 0,
        backgroundColor: "transparent",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onMouseDown(e, onStartMove);
      }}
      onDoubleClick={onDoubleClick}
    />
  );
}

