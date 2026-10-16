import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageSkeleton } from '../src';
const meta = {
  title: 'Feedback/PageSkeleton',
  component: PageSkeleton,
  args: { label: 'Loading content' },
} satisfies Meta<typeof PageSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
