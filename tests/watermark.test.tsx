import { render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Watermark } from '../src';
it('renders escaped content with unique SVG IDs and restores overlay mutations', async () => {
  const { container, rerender, unmount } = render(
    <Watermark content={'<sample & copy>'}>
      <button>Action</button>
    </Watermark>,
  );
  expect(screen.getByRole('button', { name: 'Action' })).toBeEnabled();
  const svg = container.querySelector('svg')!;
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  svg.remove();
  await waitFor(() => expect(svg.isConnected).toBe(true));
  svg.querySelector('text')!.textContent = 'changed';
  await waitFor(() => expect(svg.querySelector('text')).toHaveTextContent('<sample & copy>'));
  svg.style.opacity = '0';
  await waitFor(() => expect(svg.style.opacity).toBe('0.08'));
  rerender(<Watermark content="Updated" opacity={0.2} />);
  await waitFor(() => expect(container.querySelector('text')).toHaveTextContent('Updated'));
  expect(container.querySelector('svg')!.style.opacity).toBe('0.2');
  unmount();
  const html = renderToString(
    <>
      <Watermark content="a" />
      <Watermark content="b" />
    </>,
  );
  const ids = Array.from(html.matchAll(/<pattern id="([^"]+)"/g), (match) => match[1]);
  expect(new Set(ids).size).toBe(2);
});
