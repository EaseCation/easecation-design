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
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    reset: 'Reset',
    search: 'Search',
    keyword: 'Keyword',
    keywordPlaceholder: 'Name or identifier',
    status: 'Status',
    active: 'Active',
    paused: 'Paused',
    updatedAt: 'Updated at',
  },
  'zh-CN': {
    reset: '重置',
    search: '查询',
    keyword: '关键词',
    keywordPlaceholder: '名称或编号',
    status: '状态',
    active: '启用',
    paused: '暂停',
    updatedAt: '更新时间',
  },
} as const;

function Demo() {
  const [date, setDate] = useState('2026-07-28T09:30');
  const [status, setStatus] = useState<string[]>(['active']);
  const copy = useStoryTranslations(translations);
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <FilterBar
        actions={
          <>
            <Button variant="outline">{copy.reset}</Button>
            <Button>{copy.search}</Button>
          </>
        }
      >
        <FilterField label={copy.keyword}>
          <Input placeholder={copy.keywordPlaceholder} />
        </FilterField>
        <FilterField label={copy.status}>
          <FilterPicker
            mode="multiple"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'active', label: copy.active },
              { value: 'paused', label: copy.paused },
            ]}
          />
        </FilterField>
        <FilterField label={copy.updatedAt}>
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
