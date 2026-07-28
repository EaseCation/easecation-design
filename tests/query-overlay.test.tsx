import { createColumnHelper } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, QueryDataTable, ResponsiveDialog } from '../src';
const helper = createColumnHelper<{ id: string; name: string }>();
it('renders query data table data and empty states', () => {
  const columns = [helper.accessor('name', { header: 'Name', cell: (i) => i.getValue() })];
  const { rerender } = render(
    <QueryDataTable data={[{ id: '1', name: 'North' }]} columns={columns} getRowId={(r) => r.id} />,
  );
  expect(screen.getByText('North')).toBeInTheDocument();
  rerender(<QueryDataTable data={[]} columns={columns} />);
  expect(screen.getByText('暂无数据')).toBeInTheDocument();
});
it('renders responsive dialog with accessible close behavior', async () => {
  const user = userEvent.setup();
  let open = true;
  const { rerender } = render(
    <ResponsiveDialog
      open={open}
      onOpenChange={(v) => {
        open = v;
      }}
      title="Filters"
      footer={<Button>Apply</Button>}
    >
      Body
    </ResponsiveDialog>,
  );
  expect(screen.getByRole('dialog')).toHaveTextContent('Body');
  await user.click(screen.getByRole('button', { name: '关闭' }));
  expect(open).toBe(false);
  rerender(
    <ResponsiveDialog
      open={open}
      onOpenChange={(v) => {
        open = v;
      }}
      title="Filters"
    >
      Body
    </ResponsiveDialog>,
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
