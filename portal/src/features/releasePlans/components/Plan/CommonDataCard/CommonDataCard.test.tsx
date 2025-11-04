import { render, screen } from '@testing-library/react';
import CommonDataCard from './CommonDataCard';

it('renders owner, schedule, and id', () => {
  render(<CommonDataCard owner="Alice" startDate="2025-01-01" endDate="2025-01-31" id="p1" />);
  expect(screen.getByText('Owner: Alice')).toBeInTheDocument();
  expect(screen.getByText('Start Date: 2025-01-01')).toBeInTheDocument();
  expect(screen.getByText('End Date: 2025-01-31')).toBeInTheDocument();
  expect(screen.getByText('ID: p1')).toBeInTheDocument();
});
