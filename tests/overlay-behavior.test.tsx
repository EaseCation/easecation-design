import { LocaleProvider } from '../src/locale/LocaleProvider';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { Modal } from '../src/components/Modal';
import { Drawer } from '../src/components/Drawer';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { QueryDataTable, ResponsiveDialog } from '../src/components/Patterns/DataPatterns';
import { closeTopOverlay, getOverlayCount } from '../src/platform/overlayStack';

it('preserves layer order across callback changes and consumes Back while pending', () => {
  const lower = vi.fn();
  const upper = vi.fn();
  const ui = (pending: boolean) => (
    <>
      <Modal open title="Lower" onOpenChange={(next) => lower(next)}>
        Body
      </Modal>
      <ResponsiveDialog open title="Upper" pending={pending} onOpenChange={(next) => upper(next)}>
        Body
      </ResponsiveDialog>
    </>
  );
  const { rerender, unmount } = render(ui(false));
  expect(getOverlayCount()).toBe(2);
  rerender(ui(true));
  act(() => {
    expect(closeTopOverlay()).toBe(true);
  });
  expect(lower).not.toHaveBeenCalled();
  expect(upper).not.toHaveBeenCalled();
  rerender(ui(false));
  act(() => {
    closeTopOverlay();
  });
  expect(upper).toHaveBeenCalledWith(false);
  expect(lower).not.toHaveBeenCalled();
  unmount();
  expect(getOverlayCount()).toBe(0);
});

it.each([Modal, Drawer, ResponsiveDialog])(
  'focuses touch overlays without opening the keyboard, and restores focus',
  async (Overlay) => {
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: 1 });
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Overlay open={open} onOpenChange={setOpen} title="Editor">
            <input aria-label="Name" />
          </Overlay>
        </>
      );
    }
    try {
      render(<Example />);
      const trigger = screen.getByRole('button', { name: 'Open' });
      trigger.focus();
      fireEvent.click(trigger);
      expect(screen.getByRole('dialog')).toHaveFocus();
      expect(screen.getByRole('textbox')).not.toHaveFocus();
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      await waitFor(() => expect(trigger).toHaveFocus());
    } finally {
      Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: 0 });
    }
  },
);

it('locks confirmation, retains failed actions for retry, and closes after success', async () => {
  let reject!: (reason?: unknown) => void;
  const onConfirm = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise((_, fail) => {
          reject = fail;
        }),
    )
    .mockResolvedValueOnce(undefined);
  const onOpenChange = vi.fn();
  render(
    <ConfirmDialog open title="Remove item?" onOpenChange={onOpenChange} onConfirm={onConfirm} />,
  );
  const confirm = screen.getByRole('button', { name: 'Confirm' });
  fireEvent.click(confirm);
  fireEvent.click(confirm);
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(confirm).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  act(() => {
    closeTopOverlay();
  });
  expect(onOpenChange).not.toHaveBeenCalled();
  await act(async () => {
    reject(new Error('private server detail'));
  });
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to complete');
  expect(screen.queryByText('private server detail')).not.toBeInTheDocument();
  expect(confirm).not.toBeDisabled();
  fireEvent.click(confirm);
  await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
});

it('separates errors from empty states and retains rows while refreshing', () => {
  const columns = [{ accessorKey: 'name', header: 'Name' }];
  const { rerender } = render(
    <QueryDataTable data={[]} columns={columns} isError errorTitle="Offline" />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Offline');
  expect(screen.queryByText('No data')).not.toBeInTheDocument();
  rerender(<QueryDataTable data={[]} columns={columns} isLoading loadingLabel="Loading records" />);
  expect(screen.getByRole('status', { name: 'Loading records' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  rerender(<QueryDataTable data={[{ name: 'North' }]} columns={columns} isLoading isRefreshing />);
  expect(screen.getByRole('cell', { name: 'North' })).toBeInTheDocument();
  expect(screen.getByRole('table').closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
});

it('ignores a previous confirmation request after the dialog has been reopened', async () => {
  let resolve!: () => void;
  const onConfirm = vi.fn(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      }),
  );
  const onOpenChange = vi.fn();
  const view = (open: boolean) => (
    <ConfirmDialog open={open} title="Archive?" onOpenChange={onOpenChange} onConfirm={onConfirm} />
  );
  const { rerender } = render(view(true));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
  rerender(view(false));
  rerender(view(true));
  await act(async () => {
    resolve();
  });
  expect(onOpenChange).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Archive?' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirm' })).not.toBeDisabled();
});

it('keeps a stable upper layer when only a lower callback changes', () => {
  const lower = vi.fn();
  const upper = vi.fn();
  const renderLayers = () => (
    <>
      <Modal open title="Lower" onOpenChange={(next) => lower(next)}>
        Body
      </Modal>
      <Drawer open title="Upper" onOpenChange={upper}>
        Body
      </Drawer>
    </>
  );
  const { rerender } = render(renderLayers());
  rerender(renderLayers());
  act(() => {
    closeTopOverlay();
  });
  expect(upper).toHaveBeenCalledWith(false);
  expect(lower).not.toHaveBeenCalled();
});

it('localizes shared loading, failure and confirmation labels while allowing overrides', () => {
  const { rerender } = render(
    <LocaleProvider locale="zh-CN">
      <QueryDataTable data={[]} columns={[]} isLoading />
    </LocaleProvider>,
  );
  expect(screen.getByRole('status', { name: '正在加载' })).toBeInTheDocument();
  rerender(
    <LocaleProvider locale="zh-CN">
      <QueryDataTable data={[]} columns={[]} isError onRetry={() => undefined} />
    </LocaleProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('加载失败');
  expect(screen.getByRole('button', { name: '重试' })).toBeInTheDocument();
  rerender(
    <LocaleProvider locale="zh-CN">
      <ConfirmDialog
        open
        title="确认操作"
        confirmLabel="归档"
        onConfirm={() => undefined}
        onOpenChange={() => undefined}
      />
    </LocaleProvider>,
  );
  expect(screen.getByRole('button', { name: '归档' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
});

it('keeps normal rows when only a static error title is configured', () => {
  const columns = [{ accessorKey: 'name', header: 'Name' }];
  const { rerender } = render(
    <QueryDataTable
      data={[{ name: 'North' }]}
      columns={columns}
      errorTitle="Unable to load projects"
    />,
  );
  expect(screen.getByRole('cell', { name: 'North' })).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  rerender(
    <QueryDataTable
      data={[]}
      columns={columns}
      errorTitle="Unable to load projects"
      errorDescription="Connection lost"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Connection lost');
  rerender(
    <QueryDataTable
      data={[{ name: 'North' }]}
      columns={columns}
      isError={false}
      errorTitle="Unable to load projects"
      errorDescription="Stale error"
    />,
  );
  expect(screen.getByRole('cell', { name: 'North' })).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('renders explicit errors without any error copy', () => {
  render(<QueryDataTable data={[]} columns={[]} isError />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load');
  expect(screen.queryByText('No data')).not.toBeInTheDocument();
});
