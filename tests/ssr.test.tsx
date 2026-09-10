import { act } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { ActionCard, ThemeProvider } from '../src';

it('imports public API without requiring browser globals at module scope', async () => {
  const api = await import('../src');
  expect(api.Button).toBeTypeOf('object');
  expect(api.ActionCard).toBeTypeOf('object');
  expect(api.closeTopOverlay).toBeTypeOf('function');
}, 15_000);

it('hydrates system mode without a server/client attribute mismatch', async () => {
  const originalMatchMedia = window.matchMedia;
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  let root: Root | undefined;
  const container = document.createElement('div');

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });

  try {
    container.innerHTML = renderToString(
      <ThemeProvider mode="system">
        <span>content</span>
      </ThemeProvider>,
    );
    document.body.append(container);

    expect(container.firstElementChild).toHaveAttribute('data-ec-theme', 'light');

    await act(async () => {
      root = hydrateRoot(
        container,
        <ThemeProvider mode="system">
          <span>content</span>
        </ThemeProvider>,
      );
    });

    expect(container.firstElementChild).toHaveAttribute('data-ec-theme', 'dark');
    const errors = consoleError.mock.calls.flat().map(String).join('\n');
    expect(errors).not.toMatch(/hydration|server rendered HTML|did not match/i);
  } finally {
    if (root) {
      await act(async () => root?.unmount());
    }
    container.remove();
    consoleError.mockRestore();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    });
  }
});

it('renders ActionCard with native button semantics on the server', () => {
  const markup = renderToString(<ActionCard selected>Open player</ActionCard>);

  expect(markup).toContain('<button');
  expect(markup).toContain('aria-pressed="true"');
  expect(markup).toContain('Open player');
});
