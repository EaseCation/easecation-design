import type { Meta, StoryObj } from '@storybook/react-vite';
import { Watermark } from '../src';
const meta = { title: 'Components/Data Display/Watermark', component: Watermark } satisfies Meta<
  typeof Watermark
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Content: Story = {
  args: {
    content: 'Preview copy',
    children: (
      <div style={{ height: 300, padding: 24 }}>Decorative watermark over ordinary content.</div>
    ),
  },
};
