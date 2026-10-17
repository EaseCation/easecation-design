import type { Meta, StoryObj } from '@storybook/react-vite';
import { RecordWorkflow } from '../examples/record-workflow/RecordWorkflow';
const meta = {
  title: 'Patterns/RecordWorkflow',
  component: RecordWorkflow,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RecordWorkflow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Complete: Story = {};
