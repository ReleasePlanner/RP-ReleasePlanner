import { TIMELINE_DIMENSIONS } from "../constants";
import type { TimelineStyles } from "../hooks/useTimelineStyles";

export type TimelineContainerProps = {
  readonly styles: TimelineStyles;
  readonly children: React.ReactNode;
};

export function TimelineContainer({ styles, children }: TimelineContainerProps) {
  return (
    <div
      className="sticky z-10"
      style={{
        top: 0,
        width: styles.width,
        minWidth: styles.minWidth,
        height: TIMELINE_DIMENSIONS.TOTAL_HEIGHT,
        backgroundColor: styles.backgroundColor,
        borderBottom: styles.borderBottom,
        boxShadow: styles.boxShadow,
        backdropFilter: "blur(8px)",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

