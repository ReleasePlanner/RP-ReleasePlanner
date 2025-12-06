import { render, screen, fireEvent } from '@testing-library/react';
import PhasesList from './PhasesList';

it('renders phases and triggers callbacks', () => {
  const phases = [{ id: 'ph1', name: 'Phase 1' } as any];
  const onAdd = vi.fn();
  const onEdit = vi.fn();
  const calendarStart = '2024-01-01';
  const calendarEnd = '2024-12-31';
  render(
    <PhasesList
      phases={phases as any}
      onAdd={onAdd}
      onEdit={onEdit}
      calendarStart={calendarStart}
      calendarEnd={calendarEnd}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  expect(onAdd).toHaveBeenCalled();
  fireEvent.click(screen.getByLabelText(/edit phase/i));
  expect(onEdit).toHaveBeenCalledWith('ph1');
});


