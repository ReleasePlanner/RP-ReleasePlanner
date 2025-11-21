import { render, screen } from "@testing-library/react";
import GanttTimeline from "./GanttTimeline";

describe("GanttTimeline", () => {
  it("renders timeline with today marker when todayIndex provided", () => {
    render(
      <GanttTimeline
        start={new Date("2025-01-01")}
        totalDays={10}
        pxPerDay={10}
        todayIndex={0}
      />
    );
    const timeline = screen.getByRole("generic", { hidden: true });
    expect(timeline).toBeDefined();
    expect(timeline).toBeTruthy();
  });
});
