import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryDataTable, type QueryDataTableColumn } from '../src';
type Row = { id: string; name: string; children?: Row[] };
const data: Row[] = [
  {
    id: 'parent',
    name: 'Parent',
    children: [{ id: 'child', name: 'Child', children: [{ id: 'leaf', name: 'Leaf' }] }],
  },
];
const columns: QueryDataTableColumn<Row>[] = [
  { accessorKey: 'name', header: 'Name', size: 280, meta: { sticky: 'left' } },
];
it('expands nested rows by keyboard without losing child expansion on collapse', async () => {
  const user = userEvent.setup();
  render(
    <QueryDataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      getSubRows={(row) => row.children}
    />,
  );
  expect(screen.queryByText('Child')).not.toBeInTheDocument();
  screen.getByRole('button', { name: 'Parent' }).focus();
  await user.keyboard('{Enter}');
  await user.click(screen.getByRole('button', { name: 'Child' }));
  expect(screen.getByText('Leaf')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Parent' }));
  expect(screen.queryByText('Leaf')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Parent' }));
  expect(screen.getByText('Leaf')).toBeInTheDocument();
  expect(screen.getByRole('columnheader')).toHaveStyle({ width: '280px' });
});
it('keeps expansion controlled and reports stable row IDs', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <QueryDataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      getSubRows={(row) => row.children}
      expanded={{}}
      onExpandedChange={change}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'parent' }));
  expect(change).toHaveBeenCalledWith({ parent: true });
  expect(screen.queryByText('Child')).not.toBeInTheDocument();
  rerender(
    <QueryDataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      getSubRows={(row) => row.children}
      expanded={{ parent: true }}
      onExpandedChange={change}
    />,
  );
  expect(screen.getByText('Child')).toBeInTheDocument();
});
