import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  LocaleProvider,
  Pagination,
  ThemeProvider,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  QueryDataTable,
  DataPanel,
  SectionCard,
} from '../../src';
function Fixture() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [cursor, setCursor] = useState(1);
  const [pending, setPending] = useState(false);
  const [queryState, setQueryState] = useState('ready');
  return (
    <ThemeProvider
      mode={new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light'}
    >
      <LocaleProvider locale="zh-CN">
        <main style={{ padding: 16, display: 'grid', gap: 16, minWidth: 0 }}>
          <section data-testid="known">
            <Pagination
              page={page}
              total={600}
              pageSize={size}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setSize(size);
                setPage(1);
              }}
              showPageJump
            />
          </section>
          <section data-testid="cursor">
            <Pagination
              page={cursor}
              hasNextPage={cursor < 3}
              disabled={pending}
              onPageChange={setCursor}
            />
          </section>
          <Button onClick={() => setPending(!pending)}>Toggle pending</Button>
          <div>
            {['ready', 'loading', 'empty', 'error'].map((state) => (
              <Button key={state} onClick={() => setQueryState(state)}>
                Query {state}
              </Button>
            ))}
          </div>
          <section data-testid="query-cards" style={{ minWidth: 0 }}>
            <QueryDataTable
              isLoading={queryState === 'loading'}
              isError={queryState === 'error'}
              data={
                queryState === 'empty' ? [] : [{ id: 'key', value: 'LongConfigValue'.repeat(30) }]
              }
              columns={[{ accessorKey: 'value', header: 'Value' }]}
              getRowId={(row) => row.id}
              mobileCard={(row) => (
                <SectionCard key={row.id} title={row.value}>
                  <p>{row.value}</p>
                  <Button>Edit</Button>
                </SectionCard>
              )}
            />
          </section>
          <DataPanel
            data-testid="embedded-cards"
            toolbar={<Button>Filter records</Button>}
            footer={<Button>Next records</Button>}
          >
            <QueryDataTable
              embedded
              isLoading={queryState === 'loading'}
              isError={queryState === 'error'}
              data={
                queryState === 'empty'
                  ? []
                  : [
                      { id: 'one', value: 'LongRecordName'.repeat(12) },
                      { id: 'two', value: 'Second record' },
                    ]
              }
              columns={[{ accessorKey: 'value', header: 'Value' }]}
              getRowId={(row) => row.id}
              mobileCard={(row) => (
                <SectionCard
                  key={row.id}
                  title={row.value}
                  description={'LongDescription'.repeat(10)}
                >
                  <Button>Edit record</Button>
                </SectionCard>
              )}
            />
          </DataPanel>
          <DataPanel data-testid="forced-table">
            <QueryDataTable
              embedded
              layout="table"
              isLoading={queryState === 'loading'}
              data={[{ id: 'table', value: 'Table record' }]}
              columns={[{ accessorKey: 'value', header: 'Value' }]}
              mobileCard={(row) => <SectionCard key={row.id} title={row.value} />}
            />
          </DataPanel>
          <TableRoot mobile="cards" aria-label="Records">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell data-label="Title">
                  <div style={{ maxWidth: '24rem', overflowWrap: 'anywhere', minWidth: 0 }}>
                    {'AnnouncementLongIdentifier'.repeat(8)}
                  </div>
                </TableCell>
                <TableCell data-label="Status">Enabled</TableCell>
                <TableCell data-label="Actions">
                  <Button variant="outline">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </TableRoot>
        </main>
      </LocaleProvider>
    </ThemeProvider>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
