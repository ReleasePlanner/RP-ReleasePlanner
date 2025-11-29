import { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { daysBetween } from "../../../../../lib/date";
import PhaseBar from "../../../../Gantt/PhaseBar/PhaseBar";
import type { PlanPhase } from "../../../../types";

export interface PhaseTrackProps {
  phase: PlanPhase;
  index: number;
  startDate: Date;
  pxPerDay: number;
  trackHeight: number;
  onEditPhase?: (id: string) => void;
  clientXToDayIndex: (clientX: number) => number;
  onStartMove: (e: React.MouseEvent, phaseId: string, phaseIdx: number) => void;
  onStartResizeLeft: (e: React.MouseEvent, phaseId: string, phaseIdx: number) => void;
  onStartResizeRight: (e: React.MouseEvent, phaseId: string, phaseIdx: number) => void;
}

/**
 * Componente memoizado para renderizar una fase individual
 * Solo se re-renderiza cuando cambian las propiedades de esta fase específica
 * Optimizado para máximo rendimiento
 */
export const PhaseTrack = memo(
  function PhaseTrack({
    phase,
    index,
    startDate,
    pxPerDay,
    trackHeight,
    onEditPhase,
    clientXToDayIndex,
    onStartMove,
    onStartResizeLeft,
    onStartResizeRight,
  }: PhaseTrackProps) {
    const theme = useTheme();

    // Calcular posición y tamaño de la fase
    const phasePosition = useMemo(() => {
      if (!phase.startDate || !phase.endDate) {
        return null;
      }

      const ts = new Date(phase.startDate);
      const te = new Date(phase.endDate);
      const offset = Math.max(0, daysBetween(startDate, ts));
      const len = Math.max(1, daysBetween(ts, te));
      const color = phase.color ?? theme.palette.secondary.main;

      // Calcular segmentos excluyendo fines de semana
      const segments: { startIdx: number; length: number }[] = [];
      let segStart: number | null = null;

      for (let di = 0; di < len; di++) {
        const dayIdx = offset + di;
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + dayIdx);
        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;

        if (isWeekend) {
          if (segStart !== null) {
            segments.push({
              startIdx: segStart,
              length: dayIdx - segStart,
            });
            segStart = null;
          }
        } else {
          if (segStart === null) segStart = dayIdx;
        }
      }

      if (segStart !== null) {
        segments.push({
          startIdx: segStart,
          length: offset + len - segStart,
        });
      }

      return {
        offset,
        len,
        color,
        segments,
      };
    }, [phase.startDate, phase.endDate, phase.color, startDate, theme.palette.secondary.main]);

    if (!phasePosition || phasePosition.segments.length === 0) {
      return null;
    }

    const { offset, len, color, segments } = phasePosition;

    const tooltip = (
      <div className="text-[11px] leading-3.5">
        <div>
          <strong>{phase.name}</strong>
        </div>
        <div>
          {phase.startDate} → {phase.endDate}
        </div>
        <div>Duration: {len} days</div>
        {phase.color && <div>Color: {phase.color}</div>}
      </div>
    );

    return (
      <>
        {segments.map((seg, sIdx) => {
          const left = seg.startIdx * pxPerDay;
          const width = seg.length * pxPerDay;

          return (
            <PhaseBar
              key={`${phase.id}-seg-${sIdx}`}
              left={left}
              top={index * (trackHeight + 8) + 8}
              width={width}
              height={trackHeight}
              color={color}
              label={sIdx === 0 ? phase.name : undefined}
              title={`${phase.name} (${phase.startDate} → ${phase.endDate})`}
              ariaLabel={`${phase.name} from ${phase.startDate} to ${phase.endDate}`}
              tooltipContent={tooltip}
              testIdSuffix={phase.id}
              onDoubleClick={() => {
                if (onEditPhase) onEditPhase(phase.id);
              }}
              onStartMove={(e) => {
                onStartMove(e, phase.id, index);
              }}
              onStartResizeLeft={(e) => {
                onStartResizeLeft(e, phase.id, index);
              }}
              onStartResizeRight={(e) => {
                onStartResizeRight(e, phase.id, index);
              }}
            />
          );
        })}
      </>
    );
  },
  (prevProps, nextProps) => {
    // Comparación personalizada - solo re-renderiza si cambia esta fase específica
    return (
      prevProps.phase.id === nextProps.phase.id &&
      prevProps.phase.startDate === nextProps.phase.startDate &&
      prevProps.phase.endDate === nextProps.phase.endDate &&
      prevProps.phase.color === nextProps.phase.color &&
      prevProps.phase.name === nextProps.phase.name &&
      prevProps.index === nextProps.index &&
      prevProps.pxPerDay === nextProps.pxPerDay &&
      prevProps.trackHeight === nextProps.trackHeight &&
      prevProps.startDate.getTime() === nextProps.startDate.getTime()
    );
  }
);

