import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, LocaleProvider, type TableColumns } from '../src';
type Row = { id: number; name: string; amount: number; active: boolean };
const data: Row[] = [
  { id: 1, name: 'Alpha', amount: 30, active: false },
  { id: 2, name: 'Beta', amount: 10, active: true },
  { id: 3, name: 'Gamma', amount: 20, active: true },
];
const columns: TableColumns<Row> = [
  { title: 'Name', dataIndex: 'name', pinned: 'left', width: 150 },
  { title: 'Amount', dataIndex: 'amount', compare: (a, b) => a.amount - b.amount },
  {
    title: 'Active',
    dataIndex: 'active',
    render: (value) => String(value),
    filterOptions: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    filter: (value, row) => row.active === value,
  },
];
it('sorts before pagination, filters multiple values including false, and resets page', async () => {
  const user = userEvent.setup();
  render(
    <LocaleProvider locale="en">
      <Table columns={columns} data={data} rowKey="id" pagination={{ pageSize: 2 }} />
    </LocaleProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Amount' }));
  expect(screen.getByText('Beta')).toBeInTheDocument();
  expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Filter Active' }));
  await user.click(screen.getByRole('menuitemcheckbox', { name: 'No' }));
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  await user.click(screen.getByRole('menuitemcheckbox', { name: 'Yes' }));
  expect(screen.getByText('Beta')).toBeInTheDocument();
});
it('renders server page without slicing and emits one pagination request', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <LocaleProvider locale="en">
      <Table
        columns={columns}
        data={[data[2]]}
        rowKey="id"
        pagination={{ mode: 'server', current: 3, pageSize: 1, total: 5, onChange: change }}
      />
    </LocaleProvider>,
  );
  expect(screen.getByText('Gamma')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(change).toHaveBeenCalledExactlyOnceWith(4, 1);
});
it('preserves selections on other pages and expands details without activating the row', async () => {
  const user = userEvent.setup();
  const rowAction = vi.fn();
  function Example() {
    const [keys, setKeys] = useState<React.Key[]>([3]);
    return (
      <LocaleProvider locale="en">
        <Table
          columns={columns}
          data={data}
          rowKey="id"
          pagination={{ pageSize: 2 }}
          selection={{ selectedKeys: keys, onChange: setKeys }}
          renderExpandedRow={(row) => <p>Details {row.name}</p>}
          onRowClick={rowAction}
        />
      </LocaleProvider>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
  expect(screen.getByRole('checkbox', { name: 'Select row 1' })).toBeChecked();
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('checkbox', { name: 'Select row 3' })).toBeChecked();
  await user.click(screen.getByRole('button', { name: 'Row 3 details' }));
  expect(screen.getByText('Details Gamma')).toBeInTheDocument();
  expect(rowAction).not.toHaveBeenCalled();
  const row = screen.getByText('Gamma').closest('tr')!;
  within(row).getByRole('checkbox').focus();
  await user.keyboard(' ');
  expect(rowAction).not.toHaveBeenCalled();
});
it('retains pinned offsets and never displays a visible loading label', () => {
  const { rerender } = render(
    <Table
      data={data}
      rowKey="id"
      columns={[columns[0], { title: 'ID', dataIndex: 'id', pinned: 'left', width: 80 }]}
    />,
  );
  expect(screen.getByRole('columnheader', { name: 'ID' })).toHaveStyle({ left: '150px' });
  rerender(
    <Table data={data} rowKey="id" columns={columns} loading loadingText="Loading records" />,
  );
  expect(screen.getByRole('status', { name: 'Loading records' })).toBeInTheDocument();
  expect(screen.queryByText('Loading records')).not.toBeInTheDocument();
});

it('changes an uncontrolled page size through shared pagination', async () => {
  const user = userEvent.setup();
  render(
    <LocaleProvider locale="en">
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        pagination={{ defaultPageSize: 1, allowPageSizeChange: true }}
      />
    </LocaleProvider>,
  );
  expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByRole('option', { name: /20/ }));
  expect(screen.getByText('Gamma')).toBeInTheDocument();
});

it('keeps columns with the same accessor distinct', async () => {
  const user = userEvent.setup();
  render(
    <Table
      data={data}
      rowKey="id"
      columns={[
        { title: 'Name', dataIndex: 'name' },
        {
          title: 'Display name',
          dataIndex: 'name',
          render: (value) => `Display ${value}`,
          compare: (a, b) => a.name.localeCompare(b.name),
        },
      ]}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Display name' }));
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.getByText('Display Alpha')).toBeInTheDocument();
  expect(screen.getAllByRole('columnheader')).toHaveLength(2);
});
