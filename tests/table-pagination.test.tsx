import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from '../src';

type Row = { id: string; name: string };

it('renders generic table records and keyboard row action', async () => {
  const user = userEvent.setup();
  let selected = '';

  render(
    <Table<Row>
      columns={[{ key: 'name', title: '名称', dataIndex: 'name' }]}
      data={[{ id: '1', name: '北区工作区' }]}
      rowKey="id"
      onRowClick={(record) => {
        selected = record.name;
      }}
    />,
  );

  const row = screen.getByText('北区工作区').closest('tr')!;
  row.focus();
  await user.keyboard('{Enter}');
  expect(selected).toBe('北区工作区');
});

it('supports semantic table composition with shared density and mobile variants', () => {
  const { container } = render(
    <TableRoot compact mobile="cards">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell data-label="Name">North</TableCell>
        </TableRow>
      </TableBody>
    </TableRoot>,
  );

  expect(container.querySelector('.ec-table-wrap')).toHaveClass(
    'ec-table-wrap--cards',
    'is-compact',
  );
  expect(screen.getByRole('table')).toHaveClass('ec-table');
  expect(screen.getByRole('table')).toHaveAttribute('data-layout', 'auto');
  expect(screen.getByRole('cell', { name: 'North' })).toHaveAttribute('data-label', 'Name');
});

it('navigates pages and exposes current page', async () => {
  const user = userEvent.setup();
  let page = 2;

  render(
    <Pagination
      page={page}
      total={80}
      pageSize={10}
      onPageChange={(next: number) => {
        page = next;
      }}
    />,
  );

  expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(page).toBe(3);
});
