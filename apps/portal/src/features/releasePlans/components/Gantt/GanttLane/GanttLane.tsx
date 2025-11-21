import { useLaneStyles } from "./hooks";
import { LaneContainer } from "./components";

export type GanttLaneProps = {
  readonly top: number;
  readonly height: number;
  readonly index: number;
};

export default function GanttLane({ top, height, index }: GanttLaneProps) {
  const styles = useLaneStyles(index);

  return (
    <LaneContainer
      top={top}
      height={height}
      background={styles.background}
      borderColor={styles.borderColor}
    />
  );
}
