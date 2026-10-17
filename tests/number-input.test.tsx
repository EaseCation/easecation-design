import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { Field, NumberInput } from '../src';

it('preserves decimal drafts, normalizes on blur and steps without floating point drift', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <NumberInput
      aria-label="Amount"
      defaultValue={0.1}
      step="0.1"
      precision={2}
      onValueChange={change}
    />,
  );
  const input = screen.getByRole('spinbutton', { name: 'Amount' });
  await user.click(input);
  await user.keyboard('{ArrowUp}{ArrowUp}');
  expect(change).toHaveBeenLastCalledWith(0.3);
  await user.clear(input);
  expect(change).toHaveBeenLastCalledWith(null);
  await user.type(input, '12.345');
  expect(input).toHaveValue('12.345');
  await user.tab();
  expect(input).toHaveValue('12.35');
  expect(change).toHaveBeenLastCalledWith(12.35);
});

it('clamps on blur and respects readOnly, disabled and keyboard bounds', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <NumberInput aria-label="Quantity" min={1} max={3} defaultValue={2} onValueChange={change} />,
  );
  const input = screen.getByRole('spinbutton');
  await user.clear(input);
  await user.type(input, '9');
  await user.tab();
  expect(input).toHaveValue('3');
  await user.click(input);
  change.mockClear();
  await user.keyboard('{ArrowUp}');
  expect(change).not.toHaveBeenCalled();
  rerender(<NumberInput aria-label="Quantity" value={2} readOnly onValueChange={change} />);
  await user.keyboard('{ArrowDown}');
  expect(change).not.toHaveBeenCalled();
  rerender(<NumberInput aria-label="Quantity" value={2} disabled />);
  expect(input).toBeDisabled();
});

it('preserves high precision string values and controlled reset', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState<string | null>('9007199254740993.01');
    return (
      <>
        <NumberInput
          aria-label="Precise"
          stringMode
          value={value}
          onValueChange={setValue}
          step="0.01"
        />
        <button onClick={() => setValue(null)}>Reset</button>
      </>
    );
  }
  render(<Example />);
  const input = screen.getByRole('spinbutton');
  await user.click(input);
  await user.keyboard('{ArrowUp}');
  expect(input).toHaveValue('9007199254740993.02');
  await user.click(screen.getByRole('button', { name: 'Reset' }));
  expect(input).toHaveValue('');
});

it('connects Field errors and forwards the input ref, with SSR-safe rendering', () => {
  const ref = createRef<HTMLInputElement>();
  render(
    <Field label="Rate" error="Enter a rate">
      {(props) => <NumberInput {...props} ref={ref} status="error" />}
    </Field>,
  );
  const input = screen.getByRole('spinbutton', { name: 'Rate' });
  expect(ref.current).toBe(input);
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('Enter a rate');
  expect(renderToString(<NumberInput aria-label="Server" value={1.2} />)).toContain('spinbutton');
});
