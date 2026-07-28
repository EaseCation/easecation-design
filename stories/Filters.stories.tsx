import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Button,
  Calendar,
  DateTimePicker,
  FilterBar,
  FilterField,
  FilterPicker,
  Input,
  ThemeProvider,
} from '../src';
function Demo() {
  const [date, setDate] = useState('2026-07-28T09:30');
  const [status, setStatus] = useState<string[]>(['active']);
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <FilterBar
        actions={
          <>
            <Button variant="outline">重置</Button>
            <Button>查询</Button>
          </>
        }
      >
        <FilterField label="关键词">
          <Input placeholder="名称或编号" />
        </FilterField>
        <FilterField label="状态">
          <FilterPicker
            mode="multiple"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'active', label: '启用' },
              { value: 'paused', label: '暂停' },
            ]}
          />
        </FilterField>
        <FilterField label="更新时间">
          <DateTimePicker value={date} onChange={setDate} />
        </FilterField>
      </FilterBar>
      <Calendar mode="range" selected={{ from: new Date(2026, 6, 1), to: new Date(2026, 6, 28) }} />
    </div>
  );
}
const meta = {
  title: 'Patterns/Filter Toolbar',
  component: FilterBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Toolbar: Story = { args: {}, render: () => <Demo /> };
