import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList } from '../src/components/DescriptionList';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const items = [
  { term: 'Owner', description: 'Avery Morgan' },
  { term: 'Region', description: 'East' },
  { term: 'Status', description: 'Available' },
  { term: 'Updated', description: 'A few seconds ago' },
  {
    term: 'Endpoint',
    description: 'https://service.example.test/workspaces/operations-primary',
    span: 2 as const,
  },
];

const meta = {
  title: 'Components/Description List',
  component: DescriptionList,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem', maxWidth: '52rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
  args: {
    'aria-label': 'Workspace details',
    columns: 2,
    appearance: 'bordered',
    items,
  },
};

export const Vertical: Story = {
  args: {
    'aria-label': 'Workspace details',
    columns: 3,
    layout: 'vertical',
    items,
  },
};
