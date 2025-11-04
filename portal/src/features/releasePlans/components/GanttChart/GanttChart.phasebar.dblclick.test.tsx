import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import GanttChart from './GanttChart';
import { theme } from '../../../../theme';

describe("GanttChart phase bar double click to edit", () => {
  it("invokes onEditPhase when double clicking a phase bar", () => {
    const onEdit = vi.fn();
    const phase = {
      id: "ph1",
      name: "Phase A",
      startDate: "2025-03-10",
      endDate: "2025-03-15",
      color: "#185ABD",
    };

    render(
      <ThemeProvider theme={theme}>
        <GanttChart
          startDate="2025-01-01"
          endDate="2025-12-31"
          tasks={[]}
          phases={[phase] as any}
          onEditPhase={onEdit}
        />
      </ThemeProvider>
    );

    const overlay = screen.getByTitle("Drag to set Phase A period");
    fireEvent.doubleClick(overlay);
    expect(onEdit).toHaveBeenCalledWith("ph1");
  });
});


