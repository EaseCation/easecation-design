import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Progress } from '../src';
it('exposes bounded progress and meaningful labels independent of visible formatting', () => {
  const { rerender } = render(
    <Progress
      label="Remaining capacity"
      value={125}
      formatValue={(value) => `Remaining ${value}%`}
    />,
  );
  expect(screen.getByRole('progressbar', { name: 'Remaining capacity' })).toHaveAttribute(
    'aria-valuenow',
    '100',
  );
  expect(screen.getByText('Remaining 100%')).toBeInTheDocument();
  rerender(<Progress label="Remaining capacity" value={-10} showValue={false} />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  expect(screen.queryByText('0%')).not.toBeInTheDocument();
  rerender(<Progress label="Remaining capacity" value={NaN} />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
});
it('represents unknown totals without announcing false numeric progress and supports SSR', () => {
  render(<Progress label="Upload" value={null} />);
  expect(screen.getByRole('progressbar', { name: 'Upload' })).not.toHaveAttribute('aria-valuenow');
  expect(renderToString(<Progress label="Upload" value={50} />)).toContain('aria-valuenow="50"');
});
