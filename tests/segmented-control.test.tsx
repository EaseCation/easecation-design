import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../src';

const options = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board', disabled: true },
  { value: 'timeline', label: 'Timeline' },
];

function mockNarrowSegmentedControl(width = 170) {
  const clientWidth = vi
    .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
    .mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('ec-segmented') ? width : 0;
    });
  const offsetWidth = vi
    .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
    .mockImplementation(function (this: HTMLElement) {
      if (this.hasAttribute('data-overflow-measure-item')) return 80;
      if (this.hasAttribute('data-overflow-measure-trigger')) return 32;
      return 0;
    });
  return () => {
    clientWidth.mockRestore();
    offsetWidth.mockRestore();
  };
}

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

it('moves clipped options into a menu and keeps the selected option visible', async () => {
  const restore = mockNarrowSegmentedControl();
  const user = userEvent.setup();
  try {
    render(<SegmentedControl ariaLabel="View" options={options} defaultValue="list" />);

    expect(screen.queryByRole('radio', { name: 'Timeline' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'More options' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Timeline' }));

    expect(screen.getByRole('radio', { name: 'Timeline' })).toBeChecked();
    expect(screen.queryByRole('radio', { name: 'List' })).not.toBeInTheDocument();
  } finally {
    restore();
  }
});

it('keeps the selected option visible when it is wider than the remaining space', () => {
  const restore = mockNarrowSegmentedControl(90);
  try {
    render(<SegmentedControl ariaLabel="View" options={options} defaultValue="timeline" />);

    expect(screen.getByRole('radio', { name: 'Timeline' })).toBeChecked();
    expect(screen.getByRole('button', { name: 'More options' })).toBeInTheDocument();
  } finally {
    restore();
  }
});
