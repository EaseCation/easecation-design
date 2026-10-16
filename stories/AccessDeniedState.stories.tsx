import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccessDeniedState, Button } from '../src';
const meta = {
  title: 'Feedback/AccessDeniedState',
  component: AccessDeniedState,
  args: { action: <Button variant="outline">Return home</Button> },
} satisfies Meta<typeof AccessDeniedState>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const Embedded: StoryObj<typeof meta> = { args: { embedded: true } };
