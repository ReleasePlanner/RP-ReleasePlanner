export type LaneContainerProps = {
  readonly top: number;
  readonly height: number;
  readonly background: string;
  readonly borderColor: string;
};

export function LaneContainer({
  top,
  height,
  background,
  borderColor,
}: LaneContainerProps) {
  return (
    <div
      className="absolute left-0 right-0"
      aria-hidden
      style={{
        top,
        height,
        background,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
      }}
    />
  );
}

