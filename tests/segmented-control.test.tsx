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

it('does not overflow options for subpixel measurement rounding', () => {
  // 两个 80px 选项合计 160px，容器 .ec-segmented 还有 0.2rem（3.2px）左右内边距，
  // 组件用 clientWidth - padding 计算可用宽度；再加上 1px 的 LAYOUT_EPSILON，
  // 恰好容纳所需的宽度是 160 - 1 + 6.4 = 165.4，这里取 165.5 作为小数宽度，
  // 用来验证亚像素宽度不会被误判为溢出。
  // （此前用的 159.5 之所以"能通过"，是因为 jsdom 27 不解析样式表里的 padding，
  //   一律返回 0；jsdom 30 起会真实解析，159.5 在真实浏览器里确实会溢出。）
  const restore = mockNarrowSegmentedControl(165.5);
  try {
    render(
      <SegmentedControl
        ariaLabel="Compact view"
        options={options.filter((option) => !option.disabled)}
      />,
    );

    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'More options' })).not.toBeInTheDocument();
  } finally {
    restore();
  }
});
