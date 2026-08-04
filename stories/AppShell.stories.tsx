import {
  ActivityIcon,
  BarChart3Icon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
} from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  AppShell,
  Badge,
  Button,
  FilterBar,
  FilterField,
  FilterPicker,
  Input,
  PageScaffold,
  SectionCard,
  StatCard,
  ThemeProvider,
  type BadgeVariant,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

type ActivityTone = Extract<BadgeVariant, 'primary' | 'secondary' | 'outline'>;

const translations = {
  en: {
    overview: 'Overview',
    analytics: 'Analytics',
    settings: 'Settings',
    operations: 'Operations',
    create: 'Create',
    mobileActions: 'Quick actions stay available on small screens.',
    workspace: 'Workspace',
    dashboard: 'Operations overview',
    export: 'Export',
    revenue: 'Revenue',
    activeTeams: 'Active teams',
    availability: 'Availability',
    noChange: 'No change',
    keyword: 'Keyword',
    keywordPlaceholder: 'Name or identifier',
    status: 'Status',
    active: 'Active',
    paused: 'Paused',
    all: 'All',
    statusPlaceholder: 'Select status',
    selectedSeparator: ', ',
    reset: 'Reset',
    search: 'Search',
    activity: 'Recent activity',
    activityDescription: 'Latest workspace events across teams and automations.',
    primaryNavigation: 'Primary navigation',
    workspaceNavigation: 'Workspace',
    systemStatus: 'System status',
    operational: 'All systems operational',
    events: [
      { title: 'Report pack published', meta: 'Analytics · 2 min ago', tone: 'primary' },
      { title: 'Team access updated', meta: 'Workspace · 18 min ago', tone: 'secondary' },
      { title: 'Automation paused', meta: 'Operations · 1 hr ago', tone: 'outline' },
    ] satisfies Array<{ title: string; meta: string; tone: ActivityTone }>,
    tones: { primary: 'Done', secondary: 'Update', outline: 'Attention' } satisfies Record<
      ActivityTone,
      string
    >,
  },
  'zh-CN': {
    overview: '概览',
    analytics: '分析',
    settings: '设置',
    operations: '运营管理',
    create: '创建',
    mobileActions: '小屏下仍可快速访问常用操作。',
    workspace: '工作区',
    dashboard: '运营概览',
    export: '导出',
    revenue: '收入',
    activeTeams: '活跃团队',
    availability: '可用率',
    noChange: '无变化',
    keyword: '关键词',
    keywordPlaceholder: '名称或编号',
    status: '状态',
    active: '启用',
    paused: '暂停',
    all: '全部',
    statusPlaceholder: '选择状态',
    selectedSeparator: '、',
    reset: '重置',
    search: '查询',
    activity: '最近活动',
    activityDescription: '跨团队与自动化的最新工作区事件。',
    primaryNavigation: '主导航',
    workspaceNavigation: '工作区',
    systemStatus: '系统状态',
    operational: '所有系统运行正常',
    events: [
      { title: '报告包已发布', meta: '分析 · 2 分钟前', tone: 'primary' },
      { title: '团队权限已更新', meta: '工作区 · 18 分钟前', tone: 'secondary' },
      { title: '自动化已暂停', meta: '运营 · 1 小时前', tone: 'outline' },
    ] satisfies Array<{ title: string; meta: string; tone: ActivityTone }>,
    tones: { primary: '完成', secondary: '更新', outline: '注意' } satisfies Record<
      ActivityTone,
      string
    >,
  },
} as const;

function DashboardExample() {
  const copy = useStoryTranslations(translations);
  const [status, setStatus] = useState<string[]>(['active']);
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
      brand={<span className="ec-app-shell__brand">Atlas Admin</span>}
      sidebar={sidebar}
      headerTitle={<span className="ec-app-shell__title">{copy.operations}</span>}
      headerActions={
        <Button size="sm" pressable={false}>
          {copy.create}
        </Button>
      }
      bottomBar={<div className="ec-app-shell__bottom-note">{copy.mobileActions}</div>}
    >
      <PageScaffold
        eyebrow={copy.workspace}
        title={copy.dashboard}
        actions={
          <Button variant="outline" pressable={false}>
            {copy.export}
          </Button>
        }
      >
        <div className="ec-dashboard-metrics">
          <StatCard
            label={copy.revenue}
            value="$286,420"
            delta="18.2%"
            trend="up"
            icon={<WalletIcon />}
          />
          <StatCard
            label={copy.activeTeams}
            value="128"
            delta="8.7%"
            trend="up"
            icon={<UsersIcon />}
          />
          <StatCard
            label={copy.availability}
            value="99.97%"
            delta={copy.noChange}
            trend="steady"
            icon={<ActivityIcon />}
          />
        </div>

        <FilterBar
          actions={
            <>
              <Button variant="outline" pressable={false}>
                {copy.reset}
              </Button>
              <Button pressable={false}>{copy.search}</Button>
            </>
          }
        >
          <FilterField label={copy.keyword}>
            <Input placeholder={copy.keywordPlaceholder} />
          </FilterField>
          <FilterField label={copy.status}>
            <FilterPicker
              mode="multiple"
              value={status}
              onValueChange={setStatus}
              placeholder={copy.statusPlaceholder}
              clearLabel={copy.all}
              selectedSeparator={copy.selectedSeparator}
              options={[
                { value: 'active', label: copy.active },
                { value: 'paused', label: copy.paused },
              ]}
            />
          </FilterField>
        </FilterBar>

        <SectionCard title={copy.activity} description={copy.activityDescription}>
          <ul className="ec-dashboard-feed">
            {copy.events.map((event) => {
              const tone = event.tone as ActivityTone;
              return (
                <li key={event.title} className="ec-dashboard-feed__item">
                  <div className="ec-dashboard-feed__copy">
                    <p className="ec-dashboard-feed__title">{event.title}</p>
                    <p className="ec-dashboard-feed__meta">{event.meta}</p>
                  </div>
                  <Badge variant={tone}>{copy.tones[tone]}</Badge>
                </li>
              );
            })}
          </ul>
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
