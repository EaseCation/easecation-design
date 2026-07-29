import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateTimePicker, FilterPicker, FilterSelect, ThemeProvider } from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: { active: 'Active', paused: 'Paused', archived: 'Archived' },
  'zh-CN': { active: '启用', paused: '暂停', archived: '已归档' },
} as const;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <main
        style={{
          display: 'flex',
          minHeight: '100svh',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '4rem',
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        {children}
      </main>
    </ThemeProvider>
  );
}
function DateTimeDemo() {
  const [value, setValue] = useState('2026-07-28T09:30');
  return <DateTimePicker value={value} onChange={setValue} />;
}
function PickerDemo() {
  const [value, setValue] = useState(['active']);
  const copy = useStoryTranslations(translations);
  const options = [
    { value: 'active', label: copy.active },
    { value: 'paused', label: copy.paused },
    { value: 'archived', label: copy.archived },
  ];
  return <FilterPicker mode="multiple" value={value} onValueChange={setValue} options={options} />;
}
function SelectDemo() {
  const [value, setValue] = useState('active');
  const copy = useStoryTranslations(translations);
  const options = [
    { value: 'active', label: copy.active },
    { value: 'paused', label: copy.paused },
    { value: 'archived', label: copy.archived },
  ];
  return <FilterSelect value={value} onValueChange={setValue} options={options} />;
}
const meta = {
  title: 'Components/Filter Controls',
  component: DateTimePicker,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DateTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DateTime: Story = {
  args: { value: '', onChange: () => {} },
  render: () => (
    <Frame>
      <DateTimeDemo />
    </Frame>
  ),
};
export const Picker: Story = {
  args: { value: '', onChange: () => {} },
  render: () => (
    <Frame>
      <PickerDemo />
    </Frame>
  ),
};
export const Select: Story = {
  args: { value: '', onChange: () => {} },
  render: () => (
    <Frame>
      <SelectDemo />
    </Frame>
  ),
};
