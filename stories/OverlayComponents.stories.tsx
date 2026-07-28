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

const noop = () => {};
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
  return (
    <>
      <div style={{ padding: '4rem' }}>
        <Button
          onClick={() =>
            toast.success('Changes saved', {
              id: 'visual-toast',
              description: 'The workspace is up to date.',
              duration: Infinity,
            })
          }
        >
          Show toast
        </Button>
      </div>
      <Toaster richColors position="top-right" />
    </>
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

export const Menu: Story = {
  args,
  render: () => (
    <Frame centered>
      <DropdownMenu open onOpenChange={noop}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Workspace actions</DropdownMenuLabel>
          <DropdownMenuItem>
            Edit<DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Notifications</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete workspace</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Frame>
  ),
};
export const Dialog: Story = {
  args: { ...args, open: true },
  render: () => (
    <Frame>
      <Modal
        open
        instant
        onOpenChange={noop}
        title="Publish changes"
        description="This action updates the current workspace."
        footer={
          <>
            <Button variant="ghost">Cancel</Button>
            <Button>Confirm publish</Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>Please confirm that the changes have passed review.</p>
      </Modal>
    </Frame>
  ),
};
export const Sheet: Story = {
  args,
  render: () => (
    <Frame>
      <Drawer
        open
        instant
        placement="right"
        onOpenChange={noop}
        title="Filter options"
        description="Refine the visible records."
        footer={<Button>Apply filters</Button>}
      >
        <div style={{ padding: '1rem', fontSize: '.875rem' }}>Domain-neutral filter content.</div>
      </Drawer>
    </Frame>
  ),
};
export const PopoverSurface: Story = {
  args,
  render: () => (
    <Frame centered>
      <Popover open onOpenChange={noop}>
        <PopoverTrigger asChild>
          <Button variant="outline">Open filter</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <h3 style={{ margin: 0, fontSize: '.875rem', fontWeight: 600 }}>Filter options</h3>
          <p
            style={{ margin: '.5rem 0 0', color: 'var(--muted-foreground)', fontSize: '.8125rem' }}
          >
            Choose fields for the current view.
          </p>
        </PopoverContent>
      </Popover>
    </Frame>
  ),
};
export const TooltipSurface: Story = {
  args,
  render: () => (
    <Frame centered>
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline">Refresh data</Button>
          </TooltipTrigger>
          <TooltipContent>Fetch the latest records</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Frame>
  ),
};
export const ScrollSurface: Story = {
  args,
  render: () => (
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
              Activity record {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Frame>
  ),
};
export const ToastSurface: Story = {
  args,
  render: () => (
    <Frame>
      <ToastScene />
    </Frame>
  ),
};
