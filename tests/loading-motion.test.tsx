import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, it } from 'vitest';
import { IconButton, PageSkeleton, PageTransition, Spinner } from '../src';

it('announces standalone loading but keeps button indicators decorative and singular', () => {
  const { rerender } = render(<Spinner label="Loading account" />);
  expect(screen.getByRole('status', { name: 'Loading account' })).toBeInTheDocument();
  rerender(<IconButton label="Refresh" icon={<svg data-testid="idle-icon" />} loading />);
  const button = screen.getByRole('button', { name: 'Refresh' });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button.querySelectorAll('.ec-spinner')).toHaveLength(1);
  expect(screen.queryByTestId('idle-icon')).not.toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('provides a localized busy region while keeping skeleton shapes decorative', () => {
  render(<PageSkeleton label="Loading records" />);
  expect(screen.getByRole('status', { name: 'Loading records' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(document.querySelectorAll('.ec-skeleton[aria-hidden="true"]')).toHaveLength(3);
});

it('preserves page state on rerender and resets only when the destination key changes', () => {
  function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
  const { rerender } = render(
    <PageTransition transitionKey="one">
      <Counter />
    </PageTransition>,
  );
  fireEvent.click(screen.getByRole('button', { name: '0' }));
  rerender(
    <PageTransition transitionKey="one">
      <Counter />
    </PageTransition>,
  );
  expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  rerender(
    <PageTransition transitionKey="two">
      <Counter />
    </PageTransition>,
  );
  expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument();
});
