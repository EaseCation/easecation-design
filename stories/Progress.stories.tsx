import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress, Space } from '../src';
const meta = {
  title: 'Components/Data Display/Progress',
  component: Progress,
  args: { label: 'Progress', value: 50 },
} satisfies Meta<typeof Progress>;
export default meta;
export const States: StoryObj<typeof meta> = {
  render: () => (
    <Space direction="column" style={{ width: '100%' }}>
      <Progress label="Processed" value={42.5} />
      <Progress label="Complete" value={100} tone="success" />
      <Progress label="Capacity used" value={95} tone="warning" size="sm" />
      <Progress label="Capacity exceeded" value={100} tone="danger" />
      <Progress label="Unknown total" value={null} />
    </Space>
  ),
};
