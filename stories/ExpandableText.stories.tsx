import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpandableText } from '../src';
const meta = {
  title: 'Components/Data Display/ExpandableText',
  component: ExpandableText,
} satisfies Meta<typeof ExpandableText>;
export default meta;
type Story = StoryObj<typeof meta>;
export const LongText: Story = {
  args: {
    text: 'A long paragraph that preserves line breaks and can be expanded using a keyboard or touch.\n'.repeat(
      20,
    ),
    rows: 3,
  },
};
export const ShortText: Story = { args: { text: 'A short paragraph.' } };
export const FullText: Story = { args: { text: 'Full content\n'.repeat(10), collapsible: false } };
