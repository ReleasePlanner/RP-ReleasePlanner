import { TIMELINE_POSITIONS } from "../../../constants";

export type ButtonContainerProps = {
  readonly children: React.ReactNode;
};

export function ButtonContainer({ children }: ButtonContainerProps) {
  return (
    <div
      className="absolute"
      style={{
        top: TIMELINE_POSITIONS.TODAY_BUTTON.top,
        right: TIMELINE_POSITIONS.TODAY_BUTTON.right,
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}

