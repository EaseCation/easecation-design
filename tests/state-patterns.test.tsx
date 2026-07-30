import { fireEvent, render, screen } from '@testing-library/react';
import { EmptyState, ErrorState, InlineQueryError, SectionCard, StatCard } from '../src';
it('renders state components and retry actions', () => {
  const retry = vi.fn();
  const { rerender } = render(
    <EmptyState title="No records" description="Create the first record" />,
  );
  expect(screen.getByText('No records')).toBeInTheDocument();
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
