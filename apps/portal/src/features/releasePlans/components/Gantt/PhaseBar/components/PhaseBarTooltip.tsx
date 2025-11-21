import Tooltip from "@mui/material/Tooltip";
import type { ReactNode } from "react";

export type PhaseBarTooltipProps = {
  readonly isDragging: boolean;
  readonly tooltipContent?: ReactNode;
  readonly title?: string;
  readonly children: ReactNode;
};

export function PhaseBarTooltip({
  isDragging,
  tooltipContent,
  title,
  children,
}: PhaseBarTooltipProps) {
  const hasTooltip = tooltipContent || title;

  return (
    <Tooltip
      title={hasTooltip && !isDragging ? tooltipContent ?? title ?? "" : ""}
      placement="top"
      arrow
      enterDelay={500}
      leaveDelay={200}
      disableInteractive={false}
      disableHoverListener={isDragging}
      disableFocusListener={isDragging}
      disableTouchListener={isDragging}
      slotProps={{
        popper: {
          style: { zIndex: 1500 },
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        },
      }}
    >
      {children}
    </Tooltip>
  );
}

