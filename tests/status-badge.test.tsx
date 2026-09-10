import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../src';

it('exposes semantic tone and appearance without relying on color alone', () => {
  render(
    <StatusBadge tone="success" appearance="outline" showDot>
      Available
    </StatusBadge>,
  );

  const badge = screen.getByText('Available').closest('.ec-status-badge');
  expect(badge).toHaveAttribute('data-tone', 'success');
  expect(badge).toHaveAttribute('data-appearance', 'outline');
  expect(badge?.querySelector('.ec-status-badge__dot')).toHaveAttribute('aria-hidden', 'true');
});

it('hides a supporting icon from assistive technology', () => {
  render(<StatusBadge icon={<svg data-testid="icon" />}>Queued</StatusBadge>);

  expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
});
