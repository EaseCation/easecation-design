import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '../src';

const meta = {
  title: 'Components/Calendar/Constraints',
  component: Calendar,
  args: { min: '2026-01-01', max: '2026-12-31', labels: { single: 'Date / 日期' } },
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Bounded: Story = {};
export const Disabled: Story = { args: { disabled: true, selected: new Date(2026, 5, 15) } };
export const ReadOnly: Story = { args: { readOnly: true, selected: new Date(2026, 5, 15) } };
export const Range: Story = {
  args: { mode: 'range', labels: { rangeStart: 'Start / 开始', rangeEnd: 'End / 结束' } },
};
