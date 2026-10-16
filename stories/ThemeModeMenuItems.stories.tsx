import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ThemeModeMenuItems,
  type ThemeModeMenuValue,
} from '../src/components/ThemeModeMenuItems/ThemeModeMenuItems';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  ThemeProvider,
} from '../src';

const meta = {
  title: 'Navigation/ThemeModeMenuItems',
  component: ThemeModeMenuItems,
  args: { value: 'system', onValueChange: () => {} },
} satisfies Meta<typeof ThemeModeMenuItems>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example() {
  const [mode, setMode] = useState<ThemeModeMenuValue>('system');
  return (
    <ThemeProvider mode={mode}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Appearance</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <ThemeModeMenuItems value={mode} onValueChange={setMode} />
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeProvider>
  );
}
export const Default: Story = { render: () => <Example /> };
