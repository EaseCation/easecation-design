import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateTimePicker, FilterPicker, FilterSelect, ThemeProvider } from '../src';
const options = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];
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
  return <FilterPicker mode="multiple" value={value} onValueChange={setValue} options={options} />;
}
function SelectDemo() {
  const [value, setValue] = useState('active');
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
