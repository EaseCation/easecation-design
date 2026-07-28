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
function Reference() {
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
              设计系统迁移基线
            </h1>
            <p
              style={{
                margin: '.25rem 0 0',
                fontSize: '.875rem',
                lineHeight: '1.25rem',
                color: 'var(--muted-foreground)',
              }}
            >
              固定内容用于组件包同场景截图对比。
            </p>
          </header>
          <Card>
            <CardHeader>
              <CardTitle>基础操作</CardTitle>
              <CardDescription>按钮、徽标和头像的真实 Console Neo 样式。</CardDescription>
              <CardAction>
                <Badge>运行中</Badge>
              </CardAction>
            </CardHeader>
            <CardContent
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.5rem' }}
            >
              <Button>主要操作</Button>
              <Button variant="secondary">次要操作</Button>
              <Button variant="outline">边框按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="danger">危险操作</Button>
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
              <Button size="sm">查看详情</Button>
            </CardFooter>
          </Card>
          <div style={grid}>
            <Card>
              <CardHeader>
                <CardTitle>数据录入</CardTitle>
                <CardDescription>输入、选择和复选状态。</CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'grid', gap: '.75rem' }}>
                <Input aria-label="工作区名称" defaultValue="华东运营中心" />
                <Textarea aria-label="补充说明" placeholder="补充说明" />
                <Select
                  label="选择区域"
                  defaultValue="east"
                  options={[
                    { value: 'east', label: '华东' },
                    { value: 'west', label: '华西' },
                  ]}
                />
                <Checkbox defaultChecked label="接收每周摘要" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>内容切换</CardTitle>
                <CardDescription>Tabs 与 Skeleton 状态。</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  items={[
                    {
                      value: 'overview',
                      label: '概览',
                      content: (
                        <div style={{ display: 'grid', gap: '.75rem', paddingTop: '.75rem' }}>
                          <Skeleton style={{ height: '1rem', width: '66%' }} />
                          <Skeleton style={{ height: '5rem', width: '100%' }} />
                        </div>
                      ),
                    },
                    {
                      value: 'activity',
                      label: '活动',
                      content: (
                        <div
                          style={{
                            paddingTop: '.75rem',
                            fontSize: '.875rem',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          暂无活动记录
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
              <CardTitle>数据表格</CardTitle>
              <CardDescription>固定数据用于间距和层级对比。</CardDescription>
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  { key: 'name', title: '工作区', dataIndex: 'name' },
                  {
                    key: 'status',
                    dataIndex: 'status',
                    title: '状态',
                    render: (value) => (
                      <Badge variant={value === '运行中' ? 'secondary' : 'outline'}>
                        {String(value)}
                      </Badge>
                    ),
                  },
                  { key: 'members', title: '成员', dataIndex: 'members', align: 'right' },
                ]}
                data={[
                  { id: '1', name: '北区工作区', status: '运行中', members: 24 },
                  { id: '2', name: '内容运营', status: '维护', members: 12 },
                ]}
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
