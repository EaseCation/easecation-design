import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileTextIcon, FolderIcon, SettingsIcon } from 'lucide-react';
import { ThemeProvider, TreeView } from '../src';

const items = [
  {
    value: 'projects',
    label: 'Projects',
    icon: <FolderIcon />,
    children: [
      {
        value: 'console',
        label: 'Console',
        description: 'React application',
        icon: <FileTextIcon />,
      },
      {
        value: 'design',
        label: 'Design system',
        description: 'Shared components',
        icon: <FileTextIcon />,
      },
    ],
  },
  { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

function InteractiveTree() {
  const [selected, setSelected] = useState('console');
  const [expanded, setExpanded] = useState(['projects']);
  return (
    <TreeView
      ariaLabel="Project files"
      items={items}
      selectedValue={selected}
      onSelectedValueChange={setSelected}
      expandedValues={expanded}
      onExpandedValuesChange={setExpanded}
    />
  );
}

const meta = {
  title: 'Components/Tree View',
  component: TreeView,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: 'min(24rem, 100%)', padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: { ariaLabel: 'Project files', items },
  render: () => <InteractiveTree />,
};

export const Empty: Story = {
  args: { ariaLabel: 'Empty tree', items: [], emptyText: 'No files' },
};
