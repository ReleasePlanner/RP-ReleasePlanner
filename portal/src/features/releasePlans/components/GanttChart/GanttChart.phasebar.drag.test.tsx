import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import GanttChart from './GanttChart';
import { theme } from '../../../../theme';

describe("GanttChart phase bar drag/resize", () => {
  const phase = {
    id: "ph1",
    name: "Phase A",
    startDate: "2025-01-05",
    endDate: "2025-01-08",
    color: "#185ABD",
  };

  it("calls onPhaseRangeChange when moving a phase bar", () => {
    const spy = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <GanttChart
          startDate="2025-01-01"
          endDate="2025-12-31"
          tasks={[]}
          phases={[phase] as any}
          onPhaseRangeChange={spy}
        />
      </ThemeProvider>
    );

    const moveHandle = screen.getByTestId("phasebar-move-ph1");
    fireEvent.mouseDown(moveHandle, { clientX: 10 });
    fireEvent.mouseMove(window, { clientX: 60 });
    fireEvent.mouseUp(window, { clientX: 60 });

    expect(spy).toHaveBeenCalled();
  });

  it("calls onPhaseRangeChange when resizing a phase bar (right)", () => {
    const spy = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <GanttChart
          startDate="2025-01-01"
          endDate="2025-12-31"
          tasks={[]}
          phases={[phase] as any}
          onPhaseRangeChange={spy}
        />
      </ThemeProvider>
    );

    const rightHandle = screen.getByTestId("phasebar-resize-right-ph1");
    fireEvent.mouseDown(rightHandle, { clientX: 30 });
    fireEvent.mouseMove(window, { clientX: 120 });
    fireEvent.mouseUp(window, { clientX: 120 });

    expect(spy).toHaveBeenCalled();
  });
});


