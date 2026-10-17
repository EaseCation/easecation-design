import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { ExpandableText } from '../src';

it('renders short and non-collapsible text without an unnecessary toggle', () => {
  const { rerender } = render(<ExpandableText text="Short text" />);
  expect(screen.getByText('Short text')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  rerender(<ExpandableText text="Full text" collapsible={false} />);
  expect(screen.getByText('Full text')).not.toHaveAttribute('data-collapsed');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(renderToString(<ExpandableText text="Server text" />)).toContain('Server text');
});

it('links a keyboard toggle to overflowing text and resets for a different text', async () => {
  const height = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(100);
  const style = document.createElement('style');
  style.textContent = '.ec-expandable-text__content { line-height: 20px; }';
  document.head.append(style);
  try {
    const user = userEvent.setup();
    const { rerender } = render(
      <ExpandableText
        text="Long text"
        rows={2}
        expandLabel="Read more"
        collapseLabel="Read less"
      />,
    );
    const button = screen.getByRole('button', { name: 'Read more' });
    expect(button).toHaveAttribute('aria-controls', screen.getByText('Long text').id);
    button.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Read less' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Long text')).not.toHaveAttribute('data-collapsed');
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Read more' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await user.click(screen.getByRole('button', { name: 'Read more' }));
    rerender(
      <ExpandableText
        text="Another text"
        rows={2}
        expandLabel="Read more"
        collapseLabel="Read less"
      />,
    );
    expect(screen.getByRole('button', { name: 'Read more' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  } finally {
    height.mockRestore();
    style.remove();
  }
});
