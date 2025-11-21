import type { ReactNode } from "react";
import { usePhaseBarDrag } from "./hooks";
import {
  PhaseBarContainer,
  PhaseBarContent,
  ResizeHandle,
  MoveHandle,
  PhaseBarTooltip,
} from "./components";

export type PhaseBarProps = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly label?: string;
  readonly title?: string;
  readonly ariaLabel?: string;
  readonly tooltipContent?: ReactNode;
  readonly onStartMove?: (e: React.MouseEvent<HTMLElement>) => void;
  readonly onStartResizeLeft?: (e: React.MouseEvent<HTMLElement>) => void;
  readonly onStartResizeRight?: (e: React.MouseEvent<HTMLElement>) => void;
  readonly testIdSuffix?: string;
  readonly onDoubleClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

export default function PhaseBar({
  left,
  top,
  width,
  height,
  color,
  label,
  title,
  ariaLabel,
  tooltipContent,
  onStartMove,
  onStartResizeLeft,
  onStartResizeRight,
  testIdSuffix,
  onDoubleClick,
}: PhaseBarProps) {
  const { isDragging, handleMouseDown, handleDoubleClick, handleMouseUp } =
    usePhaseBarDrag(onStartMove, onDoubleClick);

  return (
    <PhaseBarContainer
      left={left}
      top={top}
      width={width}
      height={height}
      isDragging={isDragging}
      ariaLabel={ariaLabel}
      onDoubleClick={handleDoubleClick}
      onMouseUp={handleMouseUp}
    >
      <PhaseBarTooltip
        isDragging={isDragging}
        tooltipContent={tooltipContent}
        title={title}
      >
        <PhaseBarContent color={color} label={label}>
          <ResizeHandle
            position="left"
            testIdSuffix={testIdSuffix}
            onMouseDown={handleMouseDown}
            onStartResize={onStartResizeLeft}
          />
          <MoveHandle
            isDragging={isDragging}
            testIdSuffix={testIdSuffix}
            onMouseDown={handleMouseDown}
            onStartMove={onStartMove}
            onDoubleClick={handleDoubleClick}
          />
          <ResizeHandle
            position="right"
            testIdSuffix={testIdSuffix}
            onMouseDown={handleMouseDown}
            onStartResize={onStartResizeRight}
          />
        </PhaseBarContent>
      </PhaseBarTooltip>
    </PhaseBarContainer>
  );
}
