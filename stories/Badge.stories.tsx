import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeColor } from '../src';
const colors: BadgeColor[] = [
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'amber',
  'orange',
  'red',
  'rose',
  'pink',
  'purple',
  'indigo',
];
const meta = { title: 'Components/Badge', component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Categories: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ec-space-2)' }}>
      {colors.map((color) => (
        <Badge key={color} color={color}>
          {color}
        </Badge>
      ))}
    </div>
  ),
};
