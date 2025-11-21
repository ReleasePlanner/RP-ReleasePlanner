import { render, screen } from "@testing-library/react";
import GanttTimeline from "./GanttTimeline";

it("renders Today label when todayIndex provided", () => {
  render(
    <GanttTimeline
      start={new Date("2025-01-01")}
      totalDays={10}
      pxPerDay={10}
      todayIndex={0}
    />
  );
  const todayLabel = screen.getByText(/today/i);
  expect(todayLabel).toBeDefined();
  expect(todayLabel).toBeTruthy();
});
