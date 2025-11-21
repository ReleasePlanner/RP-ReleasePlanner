import { TaskBarContainer, TaskBarContent } from "./components";

export type TaskBarProps = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly label?: string;
  readonly title?: string;
};

export default function TaskBar({
  left,
  top,
  width,
  height,
  color,
  label,
  title,
}: TaskBarProps) {
  return (
    <TaskBarContainer
      left={left}
      top={top}
      width={width}
      height={height}
      title={title}
    >
      <TaskBarContent color={color} label={label} />
    </TaskBarContainer>
  );
}
