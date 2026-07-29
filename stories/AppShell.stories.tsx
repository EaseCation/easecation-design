import { BarChart3Icon, HomeIcon, SettingsIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActionBar,
  AppShell,
  Button,
  Card,
  CardContent,
  PageScaffold,
  SectionCard,
  StatCard,
  ThemeProvider,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    overview: 'Overview',
    analytics: 'Analytics',
    settings: 'Settings',
    operations: 'Operations',
    create: 'Create',
    mobileActions: 'Mobile actions',
    workspace: 'Workspace',
    dashboard: 'Operations dashboard',
    export: 'Export',
    filters: 'Filters and actions',
    revenue: 'Revenue',
    activeTeams: 'Active teams',
    activity: 'Activity',
    content: 'Domain-neutral dashboard content',
    primaryNavigation: 'Primary navigation',
    workspaceNavigation: 'Workspace',
    systemStatus: 'System status',
    operational: 'All systems operational',
  },
  'zh-CN': {
    overview: '概览',
    analytics: '分析',
    settings: '设置',
    operations: '运营管理',
    create: '创建',
    mobileActions: '移动端操作',
    workspace: '工作区',
    dashboard: '运营概览',
    export: '导出',
    filters: '筛选与操作',
    revenue: '收入',
    activeTeams: '活跃团队',
    activity: '活动记录',
    content: '领域中立的仪表盘内容',
    primaryNavigation: '主导航',
    workspaceNavigation: '工作区',
    systemStatus: '系统状态',
    operational: '所有系统运行正常',
  },
} as const;

function DashboardExample() {
  const copy = useStoryTranslations(translations);
  const sidebar = (
    <div className="ec-story-app-sidebar">
      <div className="ec-story-app-sidebar__brand">
        <span className="ec-story-app-sidebar__mark" aria-hidden="true">
          A
        </span>
        <span>
          <strong>Atlas</strong>
          <small>Admin workspace</small>
        </span>
      </div>
      <nav className="ec-story-app-sidebar__nav" aria-label={copy.primaryNavigation}>
        <p>{copy.workspaceNavigation}</p>
        <a className="ec-story-app-sidebar__link is-active" href="#home" aria-current="page">
          <HomeIcon />
          <span>{copy.overview}</span>
        </a>
        <a className="ec-story-app-sidebar__link" href="#analytics">
          <BarChart3Icon />
          <span>{copy.analytics}</span>
        </a>
        <a className="ec-story-app-sidebar__link" href="#settings">
          <SettingsIcon />
          <span>{copy.settings}</span>
        </a>
      </nav>
      <div className="ec-story-app-sidebar__status">
        <span className="ec-story-app-sidebar__status-dot" aria-hidden="true" />
        <span>
          <strong>{copy.systemStatus}</strong>
          <small>{copy.operational}</small>
        </span>
      </div>
    </div>
  );

  return (
    <AppShell
      brand={<b>Atlas Admin</b>}
      sidebar={sidebar}
      headerTitle={copy.operations}
      headerActions={<Button size="sm">{copy.create}</Button>}
      bottomBar={<div>{copy.mobileActions}</div>}
    >
      <PageScaffold
        eyebrow={copy.workspace}
        title={copy.dashboard}
        actions={<Button variant="outline">{copy.export}</Button>}
      >
        <ActionBar>{copy.filters}</ActionBar>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(14rem,1fr))',
            gap: '1rem',
          }}
        >
          <StatCard label={copy.revenue} value="$286,420" delta="18.2%" trend="up" />
          <StatCard label={copy.activeTeams} value="128" delta="8.7%" trend="up" />
        </div>
        <SectionCard title={copy.activity}>
          <Card>
            <CardContent>{copy.content}</CardContent>
          </Card>
        </SectionCard>
      </PageScaffold>
    </AppShell>
  );
}

const meta = {
  title: 'Patterns/App Shell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Dashboard: Story = {
  args: { brand: 'Atlas', sidebar: null, children: null },
  render: () => <DashboardExample />,
};
