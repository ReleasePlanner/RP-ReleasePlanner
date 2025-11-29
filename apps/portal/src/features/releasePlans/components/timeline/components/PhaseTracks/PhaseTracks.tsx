import { memo } from "react";
import { PhaseTrack } from "../PhaseTrack/PhaseTrack";
import type { PlanPhase } from "../../../../types";

export interface PhaseTracksProps {
  phases: PlanPhase[];
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
 * Componente que renderiza todas las fases usando PhaseTrack memoizado
 * Cada fase se renderiza independientemente, optimizando re-renders
 */
export const PhaseTracks = memo(function PhaseTracks({
  phases,
  startDate,
  pxPerDay,
  trackHeight,
  onEditPhase,
  clientXToDayIndex,
  onStartMove,
  onStartResizeLeft,
  onStartResizeRight,
}: PhaseTracksProps) {
  return (
    <>
      {phases.map((phase, index) => (
        <PhaseTrack
          key={phase.id}
          phase={phase}
          index={index}
          startDate={startDate}
          pxPerDay={pxPerDay}
          trackHeight={trackHeight}
          onEditPhase={onEditPhase}
          clientXToDayIndex={clientXToDayIndex}
          onStartMove={onStartMove}
          onStartResizeLeft={onStartResizeLeft}
          onStartResizeRight={onStartResizeRight}
        />
      ))}
    </>
  );
});

