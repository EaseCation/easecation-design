import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../src';

it('applies theme, density and token overrides', () => {
  render(
    <ThemeProvider mode="dark" density="compact" tokens={{ '--ec-color-primary': 'red' }}>
      <span>content</span>
    </ThemeProvider>,
  );
  const root = screen.getByText('content').parentElement!;
  expect(root).toHaveAttribute('data-ec-theme', 'dark');
  expect(root).toHaveAttribute('data-ec-density', 'compact');
  expect(root).toHaveStyle({ '--ec-color-primary': 'red' });
});

it('merges theme attributes into its child when asChild is enabled', () => {
  render(
    <ThemeProvider
      asChild
      mode="dark"
      density="compact"
      colorTheme="black-gold"
      className="consumer-root"
      tokens={{ '--ec-color-primary': 'gold' }}
    >
      <main className="application">content</main>
    </ThemeProvider>,
  );

  const root = screen.getByRole('main');
  expect(root).toHaveClass('application', 'ec-root', 'dark', 'consumer-root');
  expect(root).toHaveAttribute('data-ec-theme', 'dark');
  expect(root).toHaveAttribute('data-ec-color-theme', 'black-gold');
  expect(root).toHaveAttribute('data-ec-density', 'compact');
  expect(root).toHaveStyle({ '--ec-color-primary': 'gold' });
});
