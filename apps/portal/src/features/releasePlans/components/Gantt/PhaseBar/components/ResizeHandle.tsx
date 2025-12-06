import { useCallback } from "react";

export type ResizeHandleProps = {
  readonly position: "left" | "right";
  readonly testIdSuffix?: string;
  readonly onMouseDown: (
    e: React.MouseEvent<HTMLElement>,
    handler?: (e: React.MouseEvent<HTMLElement>) => void
  ) => void;
  readonly onStartResize?: (e: React.MouseEvent<HTMLElement>) => void;
};

export function ResizeHandle({
  position,
  testIdSuffix,
  onMouseDown,
  onStartResize,
}: ResizeHandleProps) {
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    },
    []
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = "transparent";
    },
    []
  );

  const title =
    position === "left"
      ? "Drag to resize start date"
      : "Drag to resize end date";
  const testId =
    position === "left"
      ? `phasebar-resize-left-${testIdSuffix}`
      : `phasebar-resize-right-${testIdSuffix}`;

  return (
    <button
      type="button"
      role="separator"
      aria-label={title}
      data-testid={testIdSuffix ? testId : undefined}
      className="absolute"
      style={{
        [position]: 0,
        top: 0,
        width: 8,
        height: "100%",
        cursor: "ew-resize",
        zIndex: 11,
        pointerEvents: "auto",
        backgroundColor: "transparent",
        transition: "background-color 0.15s ease",
        border: "none",
        padding: 0,
      }}
      onMouseDown={(e) => onMouseDown(e, onStartResize, true)} // true = immediate execution for resize
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={title}
    />
  );
}

