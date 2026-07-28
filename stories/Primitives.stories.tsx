import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Label,
  ScrollArea,
  Separator,
  ThemeProvider,
} from '../src';
const meta = {
  title: 'Components/Primitives',
  component: DropdownMenu,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '4rem', minHeight: '24rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Menu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">打开操作菜单</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>工作区操作</DropdownMenuLabel>
        <DropdownMenuItem>
          编辑<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>接收通知</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">删除工作区</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
export const ScrollAndSeparator: Story = {
  render: () => (
    <div style={{ width: '20rem', display: 'grid', gap: '1rem' }}>
      <Label>最近活动</Label>
      <Separator />
      <ScrollArea
        style={{
          height: '10rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'grid', gap: '.75rem', padding: '1rem' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>活动记录 {i + 1}</div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
