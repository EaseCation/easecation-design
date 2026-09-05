import { render, screen } from '@testing-library/react';
import { SafeArea } from '../src';
it('applies selected safe-area edges', () => {
  render(<SafeArea data-testid="safe" edges={['top', 'bottom']} />);
  expect(screen.getByTestId('safe')).toHaveStyle({
    paddingTop: 'var(--ec-safe-top)',
    paddingBottom: 'var(--ec-safe-bottom)',
  });
});
