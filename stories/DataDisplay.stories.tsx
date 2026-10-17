import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  Button,
  DataPanel,
  Pagination,
  Popover,
  Table,
  ThemeProvider,
  Tooltip,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    filter: 'Filter',
    filterOptions: 'Filter options',
    filterContent: 'Domain-neutral filter panel',
    refresh: 'Refresh',
    refreshHint: 'Fetch the latest data',
    workspace: 'Workspace',
    status: 'Status',
    members: 'Members',
    pagination: 'Pagination',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    totalLabel: '86 items',
    pageLabel: 'Page',
    rows: [
      { id: 'a', name: 'North workspace', status: 'Active', members: 24 },
      { id: 'b', name: 'Content operations', status: 'Maintenance', members: 12 },
      { id: 'c', name: 'Device management', status: 'Active', members: 38 },
    ],
  },
  'zh-CN': {
    filter: '筛选',
    filterOptions: '筛选条件',
    filterContent: '领域中立的筛选面板',
    refresh: '刷新',
    refreshHint: '重新获取最新数据',
    workspace: '工作区',
    status: '状态',
    members: '成员',
    pagination: '分页',
    previousPage: '上一页',
    nextPage: '下一页',
    totalLabel: '共 86 项',
    pageLabel: '第',
    rows: [
      { id: 'a', name: '北区工作区', status: '运行中', members: 24 },
      { id: 'b', name: '内容运营', status: '维护', members: 12 },
      { id: 'c', name: '设备管理', status: '运行中', members: 38 },
    ],
  },
} as const;

function statusVariant(status: string): 'primary' | 'outline' | 'secondary' {
  if (status === 'Active' || status === '运行中') return 'primary';
  if (status === 'Maintenance' || status === '维护') return 'outline';
  return 'secondary';
}

function WorkspaceTableExample() {
  const copy = useStoryTranslations(translations);
  return (
    <DataPanel
      toolbar={
        <div className="ec-data-panel__toolbar-actions">
          <Popover
            trigger={
              <Button variant="outline" pressable={false}>
                {copy.filter}
              </Button>
            }
            title={copy.filterOptions}
          >
            {copy.filterContent}
          </Popover>
          <Tooltip content={copy.refreshHint}>
            <Button variant="outline" pressable={false}>
              {copy.refresh}
            </Button>
          </Tooltip>
        </div>
      }
      footer={
        <Pagination
          page={2}
          total={86}
          pageSize={10}
          onPageChange={() => {}}
          ariaLabel={copy.pagination}
          previousLabel={copy.previousPage}
          nextLabel={copy.nextPage}
          totalLabel={() => copy.totalLabel}
          pageLabel={(page: number) =>
            copy.pageLabel === 'Page' ? `${copy.pageLabel} ${page}` : `${copy.pageLabel} ${page} 页`
          }
        />
      }
    >
      <Table
        mobile="scroll"
        columns={[
          { key: 'name', title: copy.workspace, dataIndex: 'name', width: '44%' },
          {
            key: 'status',
            title: copy.status,
            dataIndex: 'status',
            width: '28%',
            render: (value: unknown) => (
              <Badge variant={statusVariant(String(value))}>{String(value)}</Badge>
            ),
          },
          {
            key: 'members',
            title: copy.members,
            dataIndex: 'members',
            align: 'right',
            width: '28%',
          },
        ]}
        data={[...copy.rows]}
        rowKey="id"
      />
    </DataPanel>
  );
}

const meta = {
  title: 'Components/Table',
  component: Table,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem', maxWidth: '52rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const WorkspaceTable: Story = {
  args: {
    columns: [],
    data: [],
    rowKey: (record: unknown) => String((record as { id: string }).id),
  },
  render: () => <WorkspaceTableExample />,
};

export const InteractiveRecords: Story = {
  args: { columns: [], data: [], rowKey: () => '' },
  render: () => (
    <Table
      rowKey="id"
      pagination={{ defaultPageSize: 5, allowPageSizeChange: true, showPageJump: true }}
      minWidth={600}
      renderExpandedRow={(row) => <p>{row.name} · Record details</p>}
      data={Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Workspace ${i + 1}`,
        members: 12 - i,
        active: i % 2 === 0,
      }))}
      columns={[
        { title: 'Workspace', dataIndex: 'name', pinned: 'left', width: 200 },
        { title: 'Members', dataIndex: 'members', compare: (a, b) => a.members - b.members },
        {
          title: 'Status',
          dataIndex: 'active',
          render: (value) => (value ? 'Active' : 'Archived'),
          filterOptions: [
            { label: 'Active', value: true },
            { label: 'Archived', value: false },
          ],
          filter: (value, row) => row.active === value,
        },
      ]}
    />
  ),
};
