import { act } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { ActionCard, DataPanel, FileButton, ThemeProvider, TreeView } from '../src';

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

it('renders TreeView hierarchy without browser globals on the server', () => {
  const markup = renderToString(
    <TreeView
      ariaLabel="Files"
      defaultExpandedValues={['root']}
      items={[{ value: 'root', label: 'Root', children: [{ value: 'readme', label: 'README' }] }]}
    />,
  );

  expect(markup).toContain('role="tree"');
  expect(markup).toContain('role="treeitem"');
  expect(markup).toContain('README');
});

it('renders FileButton without accessing browser APIs on the server', () => {
  const markup = renderToString(<FileButton accept="application/json">Import</FileButton>);

  expect(markup).toContain('type="file"');
  expect(markup).toContain('Import');
});

it('renders a data panel without browser APIs on the server', () => {
  const markup = renderToString(
    <DataPanel toolbar={<span>Filters</span>} footer={<span>Pages</span>}>
      Results
    </DataPanel>,
  );

  expect(markup).toContain('ec-data-panel__toolbar');
  expect(markup).toContain('ec-data-panel__content');
  expect(markup).toContain('ec-data-panel__footer');
});
