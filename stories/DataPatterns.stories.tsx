import { createColumnHelper } from '@tanstack/react-table';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, QueryDataTable, ResponsiveDialog, ThemeProvider } from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const helper = createColumnHelper<{ id: string; name: string; status: string }>();
const translations = {
  en: {
    workspace: 'Workspace',
    status: 'Status',
    open: 'Open responsive overlay',
    rows: [
      { id: '1', name: 'North region', status: 'Active' },
      { id: '2', name: 'Content operations', status: 'Paused' },
    ],
    title: 'Filter records',
    description: 'Desktop dialog and mobile sheet share one API.',
    apply: 'Apply',
    content: 'Domain-neutral filter content.',
  },
  'zh-CN': {
    workspace: '工作区',
    status: '状态',
    open: '打开响应式浮层',
    rows: [
      { id: '1', name: '北区工作区', status: '启用' },
      { id: '2', name: '内容运营', status: '暂停' },
    ],
    title: '筛选记录',
    description: '桌面端对话框与移动端抽屉共用同一套 API。',
    apply: '应用',
    content: '领域中立的筛选内容。',
  },
} as const;

function Demo() {
  const [open, setOpen] = useState(false);
  const copy = useStoryTranslations(translations);
  const columns = [
    helper.accessor('name', { header: copy.workspace }),
    helper.accessor('status', { header: copy.status }),
  ];

  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
      <Button onClick={() => setOpen(true)}>{copy.open}</Button>
      <QueryDataTable
        data={[...copy.rows]}
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
            {row.name} ? {row.status}
          </div>
        )}
      />
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title={copy.title}
        description={copy.description}
        footer={<Button onClick={() => setOpen(false)}>{copy.apply}</Button>}
      >
        {copy.content}
      </ResponsiveDialog>
    </div>
  );
}

const meta = {
  title: 'Patterns/Data Workflows',
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
