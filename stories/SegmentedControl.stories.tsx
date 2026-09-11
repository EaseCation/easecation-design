import type { Meta, StoryObj } from '@storybook/react-vite';
import { Columns3Icon, ListIcon, Rows3Icon } from 'lucide-react';
import { useState } from 'react';
import { SegmentedControl } from '../src/components/SegmentedControl';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const options = [
  { value: 'list', label: 'List', icon: <ListIcon /> },
  { value: 'board', label: 'Board', icon: <Columns3Icon /> },
  { value: 'timeline', label: 'Timeline', icon: <Rows3Icon /> },
];

const meta = {
  title: 'Components/Segmented Control',
  component: SegmentedControl,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem', maxWidth: '36rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [value, setValue] = useState('list');
  return (
    <SegmentedControl
      ariaLabel="View"
      options={options}
      value={value}
      onValueChange={setValue}
      fullWidth
    />
  );
}

export const Interactive: Story = {
  args: { ariaLabel: 'View', options },
  render: () => <InteractiveExample />,
};

export const Sizes: Story = {
  args: { ariaLabel: 'View', options },
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <SegmentedControl ariaLabel="Small view" options={options} size="sm" />
      <SegmentedControl ariaLabel="Medium view" options={options} />
      <SegmentedControl ariaLabel="Large view" options={options} size="lg" />
    </div>
  ),
};

export const OverflowMenu: Story = {
  args: { ariaLabel: 'Workspace section', options },
  render: () => (
    <div style={{ width: '18rem' }}>
      <SegmentedControl
        ariaLabel="Workspace section"
        overflowLabel="More sections"
        options={[
          ...options,
          { value: 'activity', label: 'Activity' },
          { value: 'automation', label: 'Automation' },
          { value: 'permissions', label: 'Permissions' },
        ]}
        defaultValue="list"
      />
    </div>
  ),
};
