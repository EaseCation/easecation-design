import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
  Skeleton,
  Table,
  Tabs,
  Textarea,
  ThemeProvider,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const shell: React.CSSProperties = {
  minHeight: '100svh',
  background: 'var(--background)',
  color: 'var(--foreground)',
  padding: '2rem',
};
const page: React.CSSProperties = {
  width: '100%',
  maxWidth: '56rem',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,24rem),1fr))',
  gap: '1.5rem',
};
const translations = {
  en: {
    title: 'Component gallery',
    description: 'A fixed-content reference for reviewing component states and composition.',
    basicActions: 'Basic actions',
    basicDescription: 'Buttons, badges, and avatars in the public design language.',
    active: 'Active',
    primary: 'Primary action',
    secondary: 'Secondary action',
    outline: 'Outline button',
    ghost: 'Ghost button',
    danger: 'Danger action',
    details: 'View details',
    dataEntry: 'Data entry',
    dataEntryDescription: 'Input, selection, and checked states.',
    workspaceName: 'Workspace name',
    workspaceValue: 'East operations center',
    notes: 'Additional notes',
    region: 'Select region',
    east: 'East region',
    west: 'West region',
    weekly: 'Receive weekly summary',
    contentSwitching: 'Content switching',
    contentDescription: 'Tabs and skeleton states.',
    overview: 'Overview',
    activity: 'Activity',
    noActivity: 'No activity yet',
    dataTable: 'Data table',
    tableDescription: 'Fixed data for reviewing spacing and hierarchy.',
    workspace: 'Workspace',
    status: 'Status',
    members: 'Members',
    maintenance: 'Maintenance',
    rows: [
      { id: '1', name: 'North workspace', status: 'Active', members: 24 },
      { id: '2', name: 'Content operations', status: 'Maintenance', members: 12 },
    ],
  },
  'zh-CN': {
    title: '组件展示',
    description: '使用固定内容检查组件状态与组合效果。',
    basicActions: '基础操作',
    basicDescription: '公共设计语言中的按钮、徽标和头像。',
    active: '运行中',
    primary: '主要操作',
    secondary: '次要操作',
    outline: '边框按钮',
    ghost: '幽灵按钮',
    danger: '危险操作',
    details: '查看详情',
    dataEntry: '数据录入',
    dataEntryDescription: '输入、选择和复选状态。',
    workspaceName: '工作区名称',
    workspaceValue: '华东运营中心',
    notes: '补充说明',
    region: '选择区域',
    east: '华东',
    west: '华西',
    weekly: '接收每周摘要',
    contentSwitching: '内容切换',
    contentDescription: '标签页与骨架屏状态。',
    overview: '概览',
    activity: '活动',
    noActivity: '暂无活动记录',
    dataTable: '数据表格',
    tableDescription: '使用固定数据检查间距和层级。',
    workspace: '工作区',
    status: '状态',
    members: '成员',
    maintenance: '维护',
    rows: [
      { id: '1', name: '北区工作区', status: '运行中', members: 24 },
      { id: '2', name: '内容运营', status: '维护', members: 12 },
    ],
  },
} as const;

function Reference() {
  const copy = useStoryTranslations(translations);
  return (
    <ThemeProvider>
      <main className="ec-component-gallery" style={shell}>
        <div style={page}>
          <header>
            <p
              style={{
                margin: 0,
                fontSize: '.75rem',
                lineHeight: '1rem',
                fontWeight: 500,
                letterSpacing: '.08em',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
              }}
            >
              EaseCation Design
            </p>
            <h1
              style={{
                margin: '.5rem 0 0',
                fontSize: '1.5rem',
                lineHeight: '2rem',
                fontWeight: 600,
                letterSpacing: '-.02em',
              }}
            >
              {copy.title}
            </h1>
            <p
              style={{
                margin: '.25rem 0 0',
                fontSize: '.875rem',
                lineHeight: '1.25rem',
                color: 'var(--muted-foreground)',
              }}
            >
              {copy.description}
            </p>
          </header>
          <Card>
            <CardHeader>
              <CardTitle>{copy.basicActions}</CardTitle>
              <CardDescription>{copy.basicDescription}</CardDescription>
              <CardAction>
                <Badge>{copy.active}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.5rem' }}
            >
              <Button>{copy.primary}</Button>
              <Button variant="secondary">{copy.secondary}</Button>
              <Button variant="outline">{copy.outline}</Button>
              <Button variant="ghost">{copy.ghost}</Button>
              <Button variant="danger">{copy.danger}</Button>
              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>EC</AvatarFallback>
                  <AvatarBadge />
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>UI</AvatarFallback>
                </Avatar>
              </AvatarGroup>
            </CardContent>
            <CardFooter>
              <Button size="sm">{copy.details}</Button>
            </CardFooter>
          </Card>
          <div style={grid}>
            <Card>
              <CardHeader>
                <CardTitle>{copy.dataEntry}</CardTitle>
                <CardDescription>{copy.dataEntryDescription}</CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'grid', gap: '.75rem' }}>
                <Input aria-label={copy.workspaceName} defaultValue={copy.workspaceValue} />
                <Textarea aria-label={copy.notes} placeholder={copy.notes} />
                <Select
                  label={copy.region}
                  defaultValue="east"
                  options={[
                    { value: 'east', label: copy.east },
                    { value: 'west', label: copy.west },
                  ]}
                />
                <Checkbox defaultChecked label={copy.weekly} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{copy.contentSwitching}</CardTitle>
                <CardDescription>{copy.contentDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  items={[
                    {
                      value: 'overview',
                      label: copy.overview,
                      content: (
                        <div style={{ display: 'grid', gap: '.75rem', paddingTop: '.75rem' }}>
                          <Skeleton style={{ height: '1rem', width: '66%' }} />
                          <Skeleton style={{ height: '5rem', width: '100%' }} />
                        </div>
                      ),
                    },
                    {
                      value: 'activity',
                      label: copy.activity,
                      content: (
                        <div
                          style={{
                            paddingTop: '.75rem',
                            fontSize: '.875rem',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          {copy.noActivity}
                        </div>
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{copy.dataTable}</CardTitle>
              <CardDescription>{copy.tableDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  { key: 'name', title: copy.workspace, dataIndex: 'name' },
                  {
                    key: 'status',
                    dataIndex: 'status',
                    title: copy.status,
                    render: (value: unknown) => (
                      <Badge variant={value === copy.active ? 'secondary' : 'outline'}>
                        {String(value)}
                      </Badge>
                    ),
                  },
                  { key: 'members', title: copy.members, dataIndex: 'members', align: 'right' },
                ]}
                data={[...copy.rows]}
                rowKey="id"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </ThemeProvider>
  );
}
const meta = {
  title: 'Examples/Component Gallery',
  component: Card,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Components: Story = { render: () => <Reference /> };
