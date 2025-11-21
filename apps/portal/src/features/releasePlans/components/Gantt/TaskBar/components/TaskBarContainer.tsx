import type { ReactNode } from "react";

export type TaskBarContainerProps = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly title?: string;
  readonly children: ReactNode;
};

export function TaskBarContainer({
  left,
  top,
  width,
  height,
  title,
  children,
}: TaskBarContainerProps) {
  return (
    <div
      className="absolute"
      style={{ left, top, width, height }}
      title={title}
    >
      {children}
    </div>
  );
}

