import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Pagination,
  LocaleProvider,
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

it('keeps unknown totals honest and locks navigation while pending', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(<Pagination page={4} hasNextPage onPageChange={change} />);
  expect(screen.queryByText(/items/)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(change).toHaveBeenCalledWith(5);
  rerender(<Pagination page={4} hasNextPage disabled onPageChange={change} />);
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  rerender(<Pagination page={4} onPageChange={change} />);
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
});

it('validates jump input, respects IME and handles keyboard submit', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<Pagination page={1} total={100} showPageJump onPageChange={change} />);
  const input = screen.getByRole('spinbutton', { name: 'Go to page' });
  await user.type(input, '11{Enter}');
  expect(change).not.toHaveBeenCalled();
  await user.clear(input);
  await user.type(input, '2.5{Enter}');
  expect(change).not.toHaveBeenCalled();
  await user.clear(input);
  await user.type(input, '4');
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  expect(change).not.toHaveBeenCalled();
  await user.keyboard('{Enter}');
  expect(change).toHaveBeenCalledWith(4);
});

it('uses authoritative page counts without inventing item totals', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<Pagination page={2} totalPages={3} compact onPageChange={change} />);
  expect(screen.getByText('2 / 3')).toBeInTheDocument();
  expect(screen.queryByText(/items/)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(change).toHaveBeenCalledWith(3);
});

it('localizes controls and changes page size without assuming application state', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const sizeChange = vi.fn();
  render(
    <LocaleProvider locale="zh-CN">
      <Pagination
        page={2}
        total={140}
        pageSize={20}
        onPageChange={change}
        onPageSizeChange={sizeChange}
      />
    </LocaleProvider>,
  );
  expect(screen.getByRole('navigation', { name: '分页' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '下一页' })).toBeEnabled();
  await user.click(screen.getByRole('combobox', { name: '每页条数' }));
  await user.click(screen.getByRole('option', { name: '50 条/页' }));
  expect(sizeChange).toHaveBeenCalledWith(50);
  expect(change).not.toHaveBeenCalled();
});
