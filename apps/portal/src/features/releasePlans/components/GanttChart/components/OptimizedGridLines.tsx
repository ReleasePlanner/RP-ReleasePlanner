import { memo } from "react";

export interface OptimizedGridLinesProps {
  totalDays: number;
  pxPerDay: number;
  borderColor: string;
  /**
   * Solo renderizar líneas cada N días (ej: 7 para solo domingos)
   * Si es 1, renderiza todas las líneas
   */
  interval?: number;
}

/**
 * Componente optimizado para renderizar líneas de grid
 * Puede renderizar solo cada N días para reducir elementos DOM
 */
export const OptimizedGridLines = memo(function OptimizedGridLines({
  totalDays,
  pxPerDay,
  borderColor,
  interval = 1,
}: OptimizedGridLinesProps) {
  // ⚡ OPTIMIZATION: Solo renderizar líneas cada N días
  // Por defecto renderiza todas, pero puede reducirse para mejor rendimiento
  const linesToRender = Array.from(
    { length: Math.ceil(totalDays / interval) },
    (_, i) => i * interval
  ).filter((idx) => idx < totalDays);

  return (
    <>
      {linesToRender.map((i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: i * pxPerDay,
            width: 0,
            height: "100%",
            borderLeft: `1px solid ${borderColor}`,
          }}
        />
      ))}
    </>
  );
});

