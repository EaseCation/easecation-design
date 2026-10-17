import { fireEvent, render, screen } from '@testing-library/react';
import { EmptyState, ErrorState, InlineQueryError, SectionCard, StatCard } from '../src';
it('renders state components and retry actions', () => {
  const retry = vi.fn();
  const { rerender } = render(
    <EmptyState title="No records" description="Create the first record" embedded />,
  );
  expect(screen.getByText('No records')).toBeInTheDocument();
  expect(screen.getByText('No records').closest('.ec-empty-state')).toHaveClass('is-embedded');
  rerender(<ErrorState title="Request failed" onRetry={retry} />);
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(retry).toHaveBeenCalledOnce();
  rerender(<InlineQueryError description="Network unavailable" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load');
});
it('renders neutral card patterns', () => {
  render(
    <>
      <SectionCard title="Operations" description="Current period">
        Content
      </SectionCard>
      <StatCard
        label="Revenue"
        value="$24,800"
        delta="12.5%"
        trend="up"
        hint="Compared with previous period"
      />
    </>,
  );
  expect(screen.getByRole('heading', { name: 'Operations' })).toBeInTheDocument();
  expect(screen.getByText('$24,800')).toBeInTheDocument();
});

it('supports compact metrics without a delta and an optional action', () => {
  render(
    <StatCard
      label="Members"
      value="24"
      size="sm"
      tone="success"
      action={<button type="button">View members</button>}
    />,
  );
  expect(screen.getByText('24').closest('article')).toHaveAttribute('data-size', 'sm');
  expect(screen.getByText('24').closest('article')).toHaveAttribute('data-tone', 'success');
  expect(screen.queryByText('%')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'View members' })).toBeInTheDocument();
});

it('does not reserve an empty icon column in text-only metrics', () => {
  const { container } = render(<StatCard label="Available balance" value="1234.56" />);
  expect(container.querySelector('.ec-stat-card__aside')).toBeNull();
  expect(container.querySelector('.ec-stat-card__top')).toHaveAttribute('data-aside', 'false');
});
