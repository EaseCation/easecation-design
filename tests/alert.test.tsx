import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../src';

it('uses a polite status for non-critical feedback', () => {
  render(
    <Alert title="Saved" tone="success">
      Your changes are available to the team.
    </Alert>,
  );

  expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'success');
  expect(screen.getByText('Saved')).toBeInTheDocument();
});

it('uses an assertive alert for danger feedback and dismisses it', async () => {
  const user = userEvent.setup();
  const onDismiss = vi.fn();
  render(
    <Alert tone="danger" title="Upload failed" onDismiss={onDismiss} dismissLabel="Dismiss error">
      Try again.
    </Alert>,
  );

  expect(screen.getByRole('alert')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Dismiss error' }));
  expect(onDismiss).toHaveBeenCalledOnce();
});

it('supports a custom role and hides decorative icons', () => {
  render(
    <Alert role="note" icon={<svg data-testid="custom-icon" />}>
      Planned maintenance
    </Alert>,
  );

  expect(screen.getByRole('note')).toBeInTheDocument();
  expect(screen.getByTestId('custom-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
});

it('preserves numeric content', () => {
  render(<Alert title={0}>{0}</Alert>);

  expect(screen.getAllByText('0')).toHaveLength(2);
});
