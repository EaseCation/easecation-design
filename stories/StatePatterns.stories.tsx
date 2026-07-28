import { ActivityIcon, PlusIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  EmptyState,
  ErrorState,
  ResponsiveGrid,
  SectionCard,
  StatCard,
  ThemeProvider,
} from '../src';
const meta = {
  title: 'Migration/Console Neo states and patterns',
  component: StatCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Metrics: Story = {
  args: { label: '', value: '', delta: '', trend: 'steady' },
  render: () => (
    <ResponsiveGrid minColumnWidth="14rem">
      <StatCard
        label="Monthly revenue"
        value="$286,420"
        delta="18.2%"
        trend="up"
        icon={<ActivityIcon />}
      />
      <StatCard label="Refund rate" value="1.08%" delta="0.2%" trend="down" />
      <StatCard label="Active teams" value="128" delta="No change" trend="steady" />
    </ResponsiveGrid>
  ),
};
export const States: Story = {
  args: { label: '', value: '', delta: '', trend: 'steady' },
  render: () => (
    <SectionCard title="Content library" description="Reusable state compositions">
      <ResponsiveGrid>
        <EmptyState
          title="No content yet"
          description="Create the first reusable entry."
          action={<Button leadingIcon={<PlusIcon />}>Create</Button>}
        />
        <ErrorState
          title="Unable to load"
          description="Check the connection and try again."
          onRetry={() => {}}
        />
      </ResponsiveGrid>
    </SectionCard>
  ),
};
