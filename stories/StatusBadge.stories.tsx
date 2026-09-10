import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircleIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import { StatusBadge, ThemeProvider } from '../src';

const meta = {
  title: 'Components/Status Badge',
  component: StatusBadge,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <>
      <StatusBadge tone="neutral" showDot>
        Queued
      </StatusBadge>
      <StatusBadge tone="info" icon={<ClockIcon />}>
        Processing
      </StatusBadge>
      <StatusBadge tone="success" icon={<CheckCircleIcon />}>
        Available
      </StatusBadge>
      <StatusBadge tone="warning" icon={<TriangleAlertIcon />}>
        Attention
      </StatusBadge>
      <StatusBadge tone="danger" icon={<TriangleAlertIcon />}>
        Failed
      </StatusBadge>
    </>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, max-content))',
        gap: '0.75rem',
      }}
    >
      {(['neutral', 'info', 'success', 'warning', 'danger'] as const).flatMap((tone) =>
        (['soft', 'solid', 'outline'] as const).map((appearance) => (
          <StatusBadge key={`${tone}-${appearance}`} tone={tone} appearance={appearance}>
            {tone} {appearance}
          </StatusBadge>
        )),
      )}
    </div>
  ),
};
