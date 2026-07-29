import { type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Drawer,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Modal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  ThemeProvider,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const noop = () => {};
const translations = {
  en: {
    changesSaved: 'Changes saved',
    upToDate: 'The workspace is up to date.',
    showToast: 'Show toast',
    openActions: 'Open actions',
    workspaceActions: 'Workspace actions',
    edit: 'Edit',
    notifications: 'Notifications',
    deleteWorkspace: 'Delete workspace',
    publish: 'Publish changes',
    publishDescription: 'This action updates the current workspace.',
    cancel: 'Cancel',
    confirmPublish: 'Confirm publish',
    confirmReview: 'Please confirm that the changes have passed review.',
    filterOptions: 'Filter options',
    refineRecords: 'Refine the visible records.',
    applyFilters: 'Apply filters',
    filterContent: 'Domain-neutral filter content.',
    openFilter: 'Open filter',
    chooseFields: 'Choose fields for the current view.',
    refreshData: 'Refresh data',
    fetchLatest: 'Fetch the latest records',
    activityRecord: 'Activity record',
  },
  'zh-CN': {
    changesSaved: '变更已保存',
    upToDate: '工作区已是最新状态。',
    showToast: '显示提示',
    openActions: '打开操作菜单',
    workspaceActions: '工作区操作',
    edit: '编辑',
    notifications: '通知',
    deleteWorkspace: '删除工作区',
    publish: '发布变更',
    publishDescription: '此操作会更新当前工作区。',
    cancel: '取消',
    confirmPublish: '确认发布',
    confirmReview: '请确认变更内容已经通过审核。',
    filterOptions: '筛选条件',
    refineRecords: '缩小当前可见记录的范围。',
    applyFilters: '应用筛选',
    filterContent: '领域中立的筛选内容。',
    openFilter: '打开筛选',
    chooseFields: '选择当前视图要显示的字段。',
    refreshData: '刷新数据',
    fetchLatest: '获取最新记录',
    activityRecord: '活动记录',
  },
} as const;

function Frame({ children, centered = false }: { children: ReactNode; centered?: boolean }) {
  return (
    <ThemeProvider>
      <div
        style={{
          display: centered ? 'flex' : 'block',
          minHeight: '100svh',
          justifyContent: centered ? 'center' : undefined,
          alignItems: centered ? 'flex-start' : undefined,
          padding: centered ? '4rem' : undefined,
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}
function ToastScene() {
  const copy = useStoryTranslations(translations);
  return (
    <>
      <div style={{ padding: '4rem' }}>
        <Button
          onClick={() =>
            toast.success(copy.changesSaved, {
              id: 'visual-toast',
              description: copy.upToDate,
              duration: Infinity,
            })
          }
        >
          {copy.showToast}
        </Button>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
}
function MenuScene() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame centered>
      <DropdownMenu open onOpenChange={noop}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{copy.openActions}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{copy.workspaceActions}</DropdownMenuLabel>
          <DropdownMenuItem>
            {copy.edit}
            <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>{copy.notifications}</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">{copy.deleteWorkspace}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Frame>
  );
}
function DialogScene() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame>
      <Modal
        open
        instant
        onOpenChange={noop}
        title={copy.publish}
        description={copy.publishDescription}
        footer={
          <>
            <Button variant="ghost">{copy.cancel}</Button>
            <Button>{copy.confirmPublish}</Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>{copy.confirmReview}</p>
      </Modal>
    </Frame>
  );
}
function SheetScene() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame>
      <Drawer
        open
        instant
        placement="right"
        onOpenChange={noop}
        title={copy.filterOptions}
        description={copy.refineRecords}
        footer={<Button>{copy.applyFilters}</Button>}
      >
        <div style={{ padding: '1rem', fontSize: '.875rem' }}>{copy.filterContent}</div>
      </Drawer>
    </Frame>
  );
}
function PopoverScene() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame centered>
      <Popover open onOpenChange={noop}>
        <PopoverTrigger asChild>
          <Button variant="outline">{copy.openFilter}</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <h3 style={{ margin: 0, fontSize: '.875rem', fontWeight: 600 }}>{copy.filterOptions}</h3>
          <p
            style={{ margin: '.5rem 0 0', color: 'var(--muted-foreground)', fontSize: '.8125rem' }}
          >
            {copy.chooseFields}
          </p>
        </PopoverContent>
      </Popover>
    </Frame>
  );
}
function TooltipScene() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame centered>
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline">{copy.refreshData}</Button>
          </TooltipTrigger>
          <TooltipContent>{copy.fetchLatest}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Frame>
  );
}
function ScrollScene() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame centered>
      <ScrollArea
        style={{
          width: '20rem',
          height: '10rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'grid', gap: '.75rem', padding: '1rem' }}>
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} style={{ fontSize: '.875rem' }}>
              {copy.activityRecord} {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Frame>
  );
}

const meta = {
  title: 'Components/Floating Overlays',
  component: Modal,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
const args = { open: false, onOpenChange: noop, children: null };
export const Menu: Story = { args, render: () => <MenuScene /> };
export const Dialog: Story = { args: { ...args, open: true }, render: () => <DialogScene /> };
export const Sheet: Story = { args, render: () => <SheetScene /> };
export const PopoverSurface: Story = { args, render: () => <PopoverScene /> };
export const TooltipSurface: Story = { args, render: () => <TooltipScene /> };
export const ScrollSurface: Story = { args, render: () => <ScrollScene /> };
export const ToastSurface: Story = {
  args,
  render: () => (
    <Frame>
      <ToastScene />
    </Frame>
  ),
};
