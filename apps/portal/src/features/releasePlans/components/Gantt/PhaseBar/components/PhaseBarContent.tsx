import type { ReactNode } from "react";

export type PhaseBarContentProps = {
  readonly color: string;
  readonly label?: string;
  readonly children: ReactNode;
};

export function PhaseBarContent({
  color,
  label,
  children,
}: PhaseBarContentProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        className="h-full rounded-md opacity-75 shadow-sm"
        style={{ backgroundColor: color }}
      />
      {label && (
        <div className="absolute left-1 top-1 text-[11px] text-white/95 font-medium mix-blend-luminosity truncate pr-1 pointer-events-none">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

