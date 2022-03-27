import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calendar page', () => {
  render(<App />);
  const headingEl = screen.getByText(/calendar/i);
  expect(headingEl).toBeInTheDocument();
});
