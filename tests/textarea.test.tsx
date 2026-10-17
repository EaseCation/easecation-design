import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../src';

it('keeps the counter and existing help associated with the control', async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLTextAreaElement>();
  const { rerender } = render(
    <Textarea
      ref={ref}
      aria-label="Description"
      aria-describedby="help"
      showCount
      maxLength={12}
      defaultValue="Draft"
    />,
  );
  const textarea = screen.getByRole('textbox');
  expect(ref.current).toBe(textarea);
  expect(screen.getByText('5 / 12')).toHaveAttribute('id');
  expect(textarea.getAttribute('aria-describedby')).toContain('help');
  expect(textarea.getAttribute('aria-describedby')).toContain(screen.getByText('5 / 12').id);
  await user.clear(textarea);
  await user.type(textarea, 'Updated');
  expect(screen.getByText('7 / 12')).toBeInTheDocument();
  rerender(<Textarea ref={ref} aria-label="Description" showCount value="Reset" readOnly />);
  expect(textarea).toHaveValue('Reset');
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(textarea).not.toHaveAttribute('autoResize');
});

it('grows, bounds overflow and shrinks on controlled updates', () => {
  const style = { lineHeight: '20px', padding: '4px', border: '1px solid' };
  const { rerender } = render(
    <Textarea
      aria-label="Notes"
      style={style}
      autoResize
      minRows={2}
      maxRows={4}
      value=""
      readOnly
    />,
  );
  const textarea = screen.getByRole('textbox');
  Object.defineProperty(textarea, 'scrollHeight', { configurable: true, get: () => 200 });
  fireEvent.input(textarea);
  expect(textarea.style.height).toBe('90px');
  expect(textarea.style.overflowY).toBe('auto');
  Object.defineProperty(textarea, 'scrollHeight', { configurable: true, get: () => 28 });
  rerender(
    <Textarea
      aria-label="Notes"
      style={style}
      autoResize
      minRows={2}
      maxRows={4}
      value="short"
      readOnly
    />,
  );
  expect(textarea.style.height).toBe('50px');
  expect(textarea.style.overflowY).toBe('hidden');
  rerender(<Textarea aria-label="Notes" style={style} autoResize={false} value="short" readOnly />);
  expect(textarea.style.height).toBe('');
  expect(textarea.style.overflowY).toBe('');
});
