import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, Switch } from '../src';
it('supports checkbox and switch keyboard interaction', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Checkbox label="接受协议" />
      <Switch label="自动同步" />
    </>,
  );
  const checkbox = screen.getByRole('checkbox', { name: '接受协议' });
  await user.click(checkbox);
  expect(checkbox).toBeChecked();
  const toggle = screen.getByRole('switch', { name: '自动同步' });
  toggle.focus();
  await user.keyboard(' ');
  expect(toggle).toHaveAttribute('aria-checked', 'true');
});
it('announces indeterminate checkbox state', () => {
  render(<Checkbox label="选择全部" indeterminate />);
  expect(screen.getByRole('checkbox', { name: '选择全部' })).toHaveAttribute(
    'aria-checked',
    'mixed',
  );
});

it('supports checked-state callbacks and compact unlabeled controls', async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();
  render(
    <Checkbox aria-label="Select row" checked="indeterminate" onCheckedChange={onCheckedChange} />,
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Select row' });
  expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  expect(checkbox.parentElement).toBeInstanceOf(HTMLSpanElement);
  expect(checkbox.parentElement).not.toHaveTextContent('Select row');
  await user.click(checkbox);
  expect(onCheckedChange).toHaveBeenCalledWith(true);
});
