import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src';
it('supports typing, invalid state and clearing', async () => {
  const user = userEvent.setup();
  let cleared = false;
  render(
    <Input
      aria-label="名称"
      status="error"
      clearable
      defaultValue="Console"
      onClear={() => {
        cleared = true;
      }}
    />,
  );
  const input = screen.getByLabelText('名称');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  await user.clear(input);
  await user.type(input, 'Design');
  expect(input).toHaveValue('Design');
  await user.click(screen.getByRole('button', { name: 'Clear input' }));
  expect(cleared).toBe(true);
  expect(input).toHaveValue('');
});

it('keeps shell and native input class names separate', () => {
  render(<Input aria-label="Search" className="shell-layout" inputClassName="input-type" />);
  const input = screen.getByLabelText('Search');
  expect(input).toHaveClass('input-type');
  expect(input).not.toHaveClass('shell-layout');
  expect(input.parentElement).toHaveClass('shell-layout');
});

it('updates and resets a controlled counter without replacing existing help', () => {
  const { rerender } = render(
    <Input
      aria-label="Title"
      aria-describedby="help"
      value="Draft"
      showCount
      maxLength={120}
      readOnly
    />,
  );
  const input = screen.getByRole('textbox');
  const count = screen.getByText('5 / 120');
  expect(input.getAttribute('aria-describedby')).toContain('help');
  expect(input.getAttribute('aria-describedby')).toContain(count.id);
  rerender(<Input aria-label="Title" value="" showCount maxLength={120} readOnly />);
  expect(screen.getByText('0 / 120')).toBeInTheDocument();
  expect(input).not.toHaveAttribute('showCount');
});
