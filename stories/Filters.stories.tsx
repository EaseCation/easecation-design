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
    statusPlaceholder: 'Select status',
    all: 'All',
    dateLabel: 'Date',
    timeLabel: 'Time',
    startDate: 'Start date',
    endDate: 'End date',
    selectedSeparator: ', ',
    range: 'Date range',
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
    statusPlaceholder: '选择状态',
    all: '全部',
    dateLabel: '日期',
    timeLabel: '时间',
    startDate: '开始日期',
    endDate: '结束日期',
    selectedSeparator: '、',
    range: '日期范围',
  },
} as const;

function Demo() {
  const [date, setDate] = useState('2026-07-28T09:30');
  const [status, setStatus] = useState<string[]>(['active']);
  const [range, setRange] = useState({
    from: new Date(2026, 6, 1),
    to: new Date(2026, 6, 28),
  });
  const copy = useStoryTranslations(translations);
  return (
    <FilterBar
      actions={
        <>
          <Button variant="outline" pressable={false}>
            {copy.reset}
          </Button>
          <Button pressable={false}>{copy.search}</Button>
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
          placeholder={copy.statusPlaceholder}
          clearLabel={copy.all}
          selectedSeparator={copy.selectedSeparator}
          options={[
            { value: 'active', label: copy.active },
            { value: 'paused', label: copy.paused },
          ]}
        />
      </FilterField>
      <FilterField label={copy.updatedAt}>
        <DateTimePicker
          value={date}
          onChange={setDate}
          dateLabel={copy.dateLabel}
          timeLabel={copy.timeLabel}
        />
      </FilterField>
      <FilterField label={copy.range} className="ec-filter-field--wide">
        <Calendar
          mode="range"
          showLabel={false}
          selected={range}
          onSelect={(value) => {
            if (value && !(value instanceof Date)) {
              setRange({ from: value.from ?? range.from, to: value.to ?? range.to });
            }
          }}
          labels={{ rangeStart: copy.startDate, rangeEnd: copy.endDate }}
        />
      </FilterField>
    </FilterBar>
  );
}
const meta = {
  title: 'Patterns/Filter Toolbar',
  component: FilterBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem', maxWidth: '72rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Toolbar: Story = { args: {}, render: () => <Demo /> };
