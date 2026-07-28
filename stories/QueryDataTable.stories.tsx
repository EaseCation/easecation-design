import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, QueryDataTable, ResponsiveDialog, ThemeProvider } from '../src';
const helper = createColumnHelper<{ id: string; name: string; status: string }>();
const columns = [
  helper.accessor('name', { header: 'Workspace' }),
  helper.accessor('status', { header: 'Status' }),
];
const data = [
  { id: '1', name: 'North region', status: 'Active' },
  { id: '2', name: 'Content operations', status: 'Paused' },
];
function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <ThemeProvider>
      <main
        style={{
          minHeight: '100svh',
          padding: '2rem',
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Button onClick={() => setOpen(true)}>Open responsive overlay</Button>
          <QueryDataTable
            data={data}
            columns={columns}
            getRowId={(row) => row.id}
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
      </main>
    </ThemeProvider>
  );
}
const meta = {
  title: 'Patterns/Query Data Table',
  component: QueryDataTable,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof QueryDataTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Table: Story = { args: { data: [], columns: [] }, render: () => <Demo /> };
export const Overlay: Story = Table;
