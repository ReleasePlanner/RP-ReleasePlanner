export type TaskBarContentProps = {
  readonly color: string;
  readonly label?: string;
};

export function TaskBarContent({ color, label }: TaskBarContentProps) {
  return (
    <>
      <div
        className="h-full rounded-sm opacity-85 shadow-inner"
        style={{ backgroundColor: color }}
      />
      {label && (
        <div className="absolute left-1 top-1 text-[11px] text-white/95 font-medium mix-blend-luminosity truncate pr-1">
          {label}
        </div>
      )}
    </>
  );
}

