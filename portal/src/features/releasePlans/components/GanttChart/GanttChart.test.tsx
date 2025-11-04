import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import GanttChart from './GanttChart';
import { theme } from '../../../../theme';

it('calls onPhaseRangeChange after drag selection', () => {
  const cb = vi.fn();
  render(
    <ThemeProvider theme={theme}>
      <GanttChart
        startDate="2025-01-01"
        endDate="2025-12-31"
        tasks={[]}
        phases={[{ id: 'ph', name: 'Phase A' }] as any}
        onPhaseRangeChange={cb}
      />
    </ThemeProvider>
  );
  const overlay = screen.getByTitle(/Drag to set Phase A period/);
  fireEvent.mouseDown(overlay, { clientX: 0, clientY: 0 });
  fireEvent.mouseMove(document, { clientX: 100, clientY: 0 });
  fireEvent.mouseUp(document);
  expect(cb).toHaveBeenCalled();
});


