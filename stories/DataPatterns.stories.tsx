import { createColumnHelper } from '@tanstack/react-table';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, QueryDataTable, ResponsiveDialog, ThemeProvider } from '../src';
const helper = createColumnHelper<{ id: string; name: string; status: string }>();
const columns = [
  helper.accessor('name', { header: 'Workspace' }),
  helper.accessor('status', { header: 'Status' }),
];
function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
      <Button onClick={() => setOpen(true)}>Open responsive overlay</Button>
      <QueryDataTable
        data={[
          { id: '1', name: 'North region', status: 'Active' },
          { id: '2', name: 'Content operations', status: 'Paused' },
        ]}
        columns={columns}
        getRowId={(r) => r.id}
        mobileCard={(row) => (
          <div
            key={row.id}
            style={{
              padding: '1rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            {row.name} · {row.status}
          </div>
        )}
      />
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Filter records"
        description="Desktop dialog and mobile sheet share one API."
        footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
      >
        Domain-neutral filter content.
      </ResponsiveDialog>
    </div>
  );
}
const meta = {
  title: 'Migration/Console Neo data patterns',
  component: QueryDataTable,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof QueryDataTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Table: Story = { args: { data: [], columns: [] }, render: () => <Demo /> };
export const Overlay = Table;
