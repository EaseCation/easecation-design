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
  expect(screen.getByText('No data')).toBeInTheDocument();
});
it('marks sticky table headers and cells consistently', () => {
  const columns = [
    helper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
      meta: { sticky: 'left' },
    }),
  ];
  render(<QueryDataTable data={[{ id: '1', name: 'North' }]} columns={columns} />);
  expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('data-sticky', 'left');
  expect(screen.getByRole('cell', { name: 'North' })).toHaveAttribute('data-sticky', 'left');
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
  await user.click(screen.getByRole('button', { name: 'Close' }));
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
