import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Calendar, DatePicker, LocaleProvider, ThemeProvider } from '../src';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LocaleProvider locale="zh-CN">
          <div style={{ width: 'min(100%, 22rem)', padding: '1rem' }}>
            <Story />
          </div>
        </LocaleProvider>
      </ThemeProvider>
    ),
  ],
  args: { min: '2026-01-01', max: '2026-12-31', labels: { single: 'Date / 日期' } },
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {
  args: { selected: new Date(2026, 10, 26), showLabel: true },
};

export const Bounded: Story = {
  args: { selected: new Date(2026, 5, 15), showLabel: true },
};

export const Disabled: Story = {
  args: { disabled: true, selected: new Date(2026, 5, 15), showLabel: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, selected: new Date(2026, 5, 15), showLabel: true },
};

export const Range: Story = {
  args: {
    mode: 'range',
    selected: { from: new Date(2026, 6, 1), to: new Date(2026, 6, 7) },
    labels: { rangeStart: 'Start / 开始', rangeEnd: 'End / 结束' },
    showLabel: true,
  },
};

export const DatePopover: Story = {
  render: function Render() {
    const [value, setValue] = useState<Date | undefined>(new Date(2026, 10, 26));
    return (
      <DatePicker
        label="Date / 日期"
        value={value}
        onChange={setValue}
        min="2026-01-01"
        max="2026-12-31"
      />
    );
  },
};
