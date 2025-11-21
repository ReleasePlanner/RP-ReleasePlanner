export type TimelineRowProps = {
  readonly height: number;
  readonly children: React.ReactNode;
};

export function TimelineRow({ height, children }: TimelineRowProps) {
  return (
    <div
      className="relative"
      style={{ height, width: "100%", position: "relative", overflow: "visible" }}
    >
      {children}
    </div>
  );
}

