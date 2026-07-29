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
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    open: 'Open actions menu',
    actions: 'Workspace actions',
    edit: 'Edit',
    notifications: 'Receive notifications',
    delete: 'Delete workspace',
    recent: 'Recent activity',
    activity: 'Activity record',
  },
  'zh-CN': {
    open: '打开操作菜单',
    actions: '工作区操作',
    edit: '编辑',
    notifications: '接收通知',
    delete: '删除工作区',
    recent: '最近活动',
    activity: '活动记录',
  },
} as const;

function MenuExample() {
  const copy = useStoryTranslations(translations);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{copy.open}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{copy.actions}</DropdownMenuLabel>
        <DropdownMenuItem>
          {copy.edit}
          <DropdownMenuShortcut>?E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>{copy.notifications}</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">{copy.delete}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function ScrollExample() {
  const copy = useStoryTranslations(translations);
  return (
    <div style={{ width: '20rem', display: 'grid', gap: '1rem' }}>
      <Label>{copy.recent}</Label>
      <Separator />
      <ScrollArea
        style={{
          height: '10rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'grid', gap: '.75rem', padding: '1rem' }}>
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index}>
              {copy.activity} {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

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
export const Menu: Story = { render: () => <MenuExample /> };
export const ScrollAndSeparator: Story = { render: () => <ScrollExample /> };
