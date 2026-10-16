import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '../src';
const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  args: { label: 'Loading' },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Spinner size="sm" label="Loading" />
      <Spinner size="md" label="Loading" />
      <Spinner size="lg" label="Loading" />
    </div>
  ),
};
