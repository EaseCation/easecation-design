import { Button, QueryDataTable, SectionCard, StatusBadge } from '../../src';

const rows = [
  {
    id: 'long',
    code: 'record_'.repeat(14),
    name: 'Extended record name '.repeat(10),
    description: 'A detailed description that must stay inside its own column. '.repeat(8),
    address: `https://example.com/callback/${'unbroken-path'.repeat(32)}`,
    count: 123456789,
  },
  {
    id: 'unbroken',
    code: 'identifier'.repeat(10),
    name: '这是很长的记录名称'.repeat(12),
    description: 'description'.repeat(45),
    address: 'https://example.com/short',
    count: 0,
  },
  { id: 'empty', code: 'short', name: 'Short name', description: '', address: '', count: 1 },
];

function Labels() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ec-space-1)', maxWidth: 260 }}>
      {['Read', 'Write', 'Delete', 'Share', 'Export', 'Archive'].map((label, index) => (
        <StatusBadge key={label} tone={index % 2 ? 'neutral' : 'primary'} appearance="outline">
          {label}
        </StatusBadge>
      ))}
    </div>
  );
}

/** Domain-neutral long-content example shared by Storybook and browser regression checks. */
export function LongContentTable({ minWidth }: { minWidth?: number }) {
  return (
    <QueryDataTable
      data={rows}
      getRowId={(row) => row.id}
      minWidth={minWidth}
      columns={[
        {
          accessorKey: 'code',
          header: 'Code / name',
          cell: ({ row }) => (
            <div style={{ display: 'grid', gap: 'var(--ec-space-1)' }}>
              <code>{row.original.code}</code>
              <span>{row.original.name}</span>
            </div>
          ),
        },
        {
          accessorKey: 'description',
          header: 'Description',
          cell: ({ getValue }) => (
            <span style={{ display: 'block', maxWidth: 240 }}>{getValue() || '—'}</span>
          ),
        },
        {
          accessorKey: 'address',
          header: 'Address',
          cell: ({ getValue }) => (
            <span
              title={getValue() || undefined}
              style={{
                display: 'block',
                width: 160,
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {getValue() || '—'}
            </span>
          ),
        },
        { accessorKey: 'count', header: 'Count', meta: { wrap: false } },
        { id: 'labels', header: 'Labels', cell: () => <Labels /> },
        {
          id: 'actions',
          header: 'Actions',
          size: 88,
          meta: { sticky: 'right' },
          cell: () => (
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          ),
        },
      ]}
      mobileCard={(row) => (
        <SectionCard key={row.id} title={row.code} description={row.name}>
          <p style={{ overflowWrap: 'anywhere' }}>{row.description || '—'}</p>
          <Labels />
        </SectionCard>
      )}
    />
  );
}
