import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionCard, StatusBadge, ThemeProvider } from '../src';

const meta = {
  title: 'Components/Action Card',
  component: ActionCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: 'min(100%, 42rem)', padding: '1rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
        gap: '0.75rem',
      }}
    >
      <ActionCard>
        <strong style={{ display: 'block' }}>Player Alpha</strong>
        <span style={{ color: 'var(--ec-color-text-muted)', fontSize: '0.8125rem' }}>
          Ready to open
        </span>
      </ActionCard>
      <ActionCard selected>
        <strong style={{ display: 'block' }}>Player Beta</strong>
        <StatusBadge tone="success">Selected</StatusBadge>
      </ActionCard>
      <ActionCard disabled>
        <strong style={{ display: 'block' }}>Player Gamma</strong>
        <span style={{ color: 'var(--ec-color-text-muted)', fontSize: '0.8125rem' }}>
          Unavailable
        </span>
      </ActionCard>
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <ActionCard size="sm">
      <strong style={{ display: 'block' }}>Compact action</strong>
      <span style={{ color: 'var(--ec-color-text-muted)', fontSize: '0.8125rem' }}>
        Maintains a 44px touch target.
      </span>
    </ActionCard>
  ),
};
