import type { ReactNode } from "react";

export type PhaseBarContainerProps = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly isDragging: boolean;
  readonly ariaLabel?: string;
  readonly onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  readonly onMouseUp: () => void;
  readonly children: ReactNode;
};

export function PhaseBarContainer({
  left,
  top,
  width,
  height,
  isDragging,
  ariaLabel,
  onDoubleClick,
  onMouseUp,
  children,
}: PhaseBarContainerProps) {
  return (
    <div
      className="absolute"
      role="application"
      tabIndex={0}
      style={{
        left,
        top,
        width,
        height,
        zIndex: 10,
        pointerEvents: "auto",
        willChange: isDragging ? "transform" : "auto",
        transform: isDragging ? "translateZ(0)" : "none",
        backfaceVisibility: "hidden",
      }}
      aria-label={ariaLabel}
      onDoubleClick={onDoubleClick}
      onMouseUp={onMouseUp}
    >
      {children}
    </div>
  );
}

