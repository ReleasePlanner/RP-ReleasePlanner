import { memo } from "react";
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import { addDays } from "../../../../../lib/date";
import type { TimelineViewportRange } from "../../types/timeline.types";

export interface VirtualizedDaysProps {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  startDate: Date;
  pxPerDay: number;
  renderDay: (day: Date, index: number, style: React.CSSProperties) => React.ReactNode;
}

/**
 * Componente para renderizar días virtualizados
 * Solo renderiza los días visibles en el viewport
 */
export const VirtualizedDays = memo(function VirtualizedDays({
  virtualizer,
  startDate,
  pxPerDay,
  renderDay,
}: VirtualizedDaysProps) {
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <>
      {virtualItems.map((virtualItem) => {
        const day = addDays(startDate, virtualItem.index);
        const style: React.CSSProperties = {
          position: "absolute",
          top: 0,
          left: `${virtualItem.start}px`,
          width: `${virtualItem.size}px`,
          height: "100%",
        };

        return (
          <div key={virtualItem.key} style={style}>
            {renderDay(day, virtualItem.index, style)}
          </div>
        );
      })}
    </>
  );
});

