import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Pagination, Popover, Table, ThemeProvider, Tooltip } from '../src';
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
    rows: [
      { id: 'a', name: '北区工作区', status: '运行中', members: 24 },
      { id: 'b', name: '内容运营', status: '维护', members: 12 },
      { id: 'c', name: '设备管理', status: '运行中', members: 38 },
    ],
  },
} as const;

function WorkspaceTableExample() {
  const copy = useStoryTranslations(translations);
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <Popover
          trigger={<Button variant="outline">{copy.filter}</Button>}
          title={copy.filterOptions}
        >
          {copy.filterContent}
        </Popover>
        <Tooltip content={copy.refreshHint}>
          <Button variant="ghost">{copy.refresh}</Button>
        </Tooltip>
      </div>
      <Table
        mobile="cards"
        columns={[
          { key: 'name', title: copy.workspace, dataIndex: 'name' },
          { key: 'status', title: copy.status, dataIndex: 'status' },
          { key: 'members', title: copy.members, dataIndex: 'members', align: 'right' },
        ]}
        data={[...copy.rows]}
        rowKey="id"
      />
      <Pagination page={2} total={86} pageSize={10} onPageChange={() => {}} />
    </div>
  );
}

const meta = {
  title: 'Components/Table',
  component: Table,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const WorkspaceTable: Story = {
  args: { columns: [], data: [], rowKey: (record) => String((record as { id: string }).id) },
  render: () => <WorkspaceTableExample />,
};
