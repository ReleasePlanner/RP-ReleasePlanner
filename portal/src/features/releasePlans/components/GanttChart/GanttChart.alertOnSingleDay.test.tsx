import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import GanttChart from './GanttChart';
import { theme } from '../../../../theme';

const phase = {
  id: "ph1",
  name: "Phase A",
  startDate: "2025-03-10",
  endDate: "2025-03-15",
  color: "#185ABD",
};

describe("GanttChart alert at day/phase intersection", () => {
  it("shows alert when selecting exactly one day in a phase lane", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <ThemeProvider theme={theme}>
        <GanttChart
          startDate="2025-01-01"
          endDate="2025-12-31"
          tasks={[]}
          phases={[phase] as any}
        />
      </ThemeProvider>
    );

    // Overlay has a title like: "Drag to set Phase A period"
    const overlay = screen.getByTitle(/Drag to set Phase A period/i);

    // Click in the phase lane at clientX=1 to trigger day alert
    fireEvent.click(overlay, { clientX: 1 });

    // Expect alert for a single selected day
    expect(alertSpy).toHaveBeenCalledTimes(1);
    const call = (alertSpy.mock.calls[0] || [])[0] as string;
    expect(call).toMatch(/Selected day: \d{4}-01-0\d/);

    alertSpy.mockRestore();
  });
});


