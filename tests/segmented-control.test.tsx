import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../src';

const options = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board', disabled: true },
  { value: 'timeline', label: 'Timeline' },
];

it('selects a value with pointer input', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <SegmentedControl
      ariaLabel="View"
      options={options}
      defaultValue="list"
      onValueChange={onValueChange}
    />,
  );

  await user.click(screen.getByRole('radio', { name: 'Timeline' }));
  expect(screen.getByRole('radio', { name: 'Timeline' })).toBeChecked();
  expect(onValueChange).toHaveBeenLastCalledWith('timeline');
});

it('wraps arrow navigation and skips disabled options', async () => {
  const user = userEvent.setup();
  render(<SegmentedControl ariaLabel="View" options={options} defaultValue="list" />);

  const list = screen.getByRole('radio', { name: 'List' });
  list.focus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('radio', { name: 'Timeline' })).toBeChecked();
  await user.keyboard('{ArrowRight}');
  expect(list).toBeChecked();
});

it('uses vertical arrow keys when vertically oriented', async () => {
  const user = userEvent.setup();
  render(
    <SegmentedControl
      ariaLabel="View"
      options={options}
      defaultValue="timeline"
      orientation="vertical"
    />,
  );

  const timeline = screen.getByRole('radio', { name: 'Timeline' });
  timeline.focus();
  await user.keyboard('{ArrowUp}');
  expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
  expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'vertical');
});
