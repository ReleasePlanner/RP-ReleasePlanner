import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PhaseRow } from "./PhaseRow";
import type { PhaseRowProps } from "./PhaseRow";

export type SortablePhaseRowProps = PhaseRowProps & {
  readonly isReorderMode: boolean;
};

export const SortablePhaseRow = memo(function SortablePhaseRow({
  phase,
  isReorderMode,
  ...props
}: SortablePhaseRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: phase.id, disabled: !isReorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isReorderMode ? "grab" : "default",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PhaseRow
        phase={phase}
        {...props}
        dragHandleProps={isReorderMode ? { ...attributes, ...listeners } : undefined}
      />
    </div>
  );
});

