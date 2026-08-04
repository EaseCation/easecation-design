import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityIcon, GaugeIcon, UsersIcon } from 'lucide-react';
import {
  AccessGate,
  Button,
  Container,
  Flex,
  FormItem,
  Input,
  PageHeader,
  SafeArea,
  SectionCard,
  StatCard,
  Surface,
  Tabs,
  ThemeProvider,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    primary: 'Primary action',
    secondary: 'Secondary action',
    outline: 'Outline button',
    ghost: 'Ghost button',
    danger: 'Danger action',
    loading: 'Processing',
    eyebrow: 'Operations',
    title: 'Operations overview',
    description: 'A domain-neutral example for content, retail, IoT, or enterprise tools.',
    createReport: 'Create report',
    metrics: [
      { label: 'Active workspaces', value: '128', delta: '8.7%', trend: 'up' as const },
      { label: 'Automation tasks', value: '4,862', delta: '12.4%', trend: 'up' as const },
      {
        label: 'Service availability',
        value: '99.97%',
        delta: 'No change',
        trend: 'steady' as const,
      },
    ] satisfies Array<{
      label: string;
      value: string;
      delta: string;
      trend: 'up' | 'down' | 'steady';
    }>,
    overview: 'Overview',
    activity: 'Activity log',
    workspaceName: 'Workspace name',
    help: 'The name can be changed at any time.',
    placeholder: 'For example: East operations center',
    noActivity: 'No activity yet',
    platformTitle: 'Platform boundaries',
    safeArea: 'Safe-area padding',
    accessAllowed: 'Allowed content',
    accessFallback: 'Fallback content',
  },
  'zh-CN': {
    primary: '主要操作',
    secondary: '次要操作',
    outline: '边框按钮',
    ghost: '幽灵按钮',
    danger: '危险操作',
    loading: '处理中',
    eyebrow: '运营管理',
    title: '运营概览',
    description: '领域中立示例：用于内容、零售、物联网或企业工具。',
    createReport: '创建报告',
    metrics: [
      { label: '活跃工作区', value: '128', delta: '8.7%', trend: 'up' as const },
      { label: '自动化任务', value: '4,862', delta: '12.4%', trend: 'up' as const },
      { label: '服务可用率', value: '99.97%', delta: '无变化', trend: 'steady' as const },
    ] satisfies Array<{
      label: string;
      value: string;
      delta: string;
      trend: 'up' | 'down' | 'steady';
    }>,
    overview: '概览',
    activity: '活动记录',
    workspaceName: '工作区名称',
    help: '名称可以随时修改。',
    placeholder: '例如：华东运营中心',
    noActivity: '暂无活动记录',
    platformTitle: '平台边界',
    safeArea: '安全区域内边距',
    accessAllowed: '允许访问的内容',
    accessFallback: '兜底内容',
  },
} as const;

function ButtonsExample() {
  const copy = useStoryTranslations(translations);
  return (
    <Flex wrap>
      <Button pressable={false}>{copy.primary}</Button>
      <Button variant="secondary" pressable={false}>
        {copy.secondary}
      </Button>
      <Button variant="outline" pressable={false}>
        {copy.outline}
      </Button>
      <Button variant="ghost" pressable={false}>
        {copy.ghost}
      </Button>
      <Button variant="danger" pressable={false}>
        {copy.danger}
      </Button>
      <Button loading pressable={false}>
        {copy.loading}
      </Button>
    </Flex>
  );
}
function DashboardExample() {
  const copy = useStoryTranslations(translations);
  const icons = [<UsersIcon key="users" />, <GaugeIcon key="gauge" />, <ActivityIcon key="activity" />];
  return (
    <div className="ec-foundation-dashboard">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={
          <Button pressable={false}>{copy.createReport}</Button>
        }
      />
      <div className="ec-dashboard-metrics">
        {copy.metrics.map((metric, index) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            delta={metric.delta}
            trend={metric.trend as 'up' | 'down' | 'steady'}
            icon={icons[index]}
          />
        ))}
      </div>
      <SectionCard title={copy.overview}>
        <Tabs
          items={[
            {
              value: 'overview',
              label: copy.overview,
              content: (
                <FormItem label={copy.workspaceName} help={copy.help}>
                  <Input placeholder={copy.placeholder} />
                </FormItem>
              ),
            },
            { value: 'activity', label: copy.activity, content: copy.noActivity },
          ]}
        />
      </SectionCard>
    </div>
  );
}
function PlatformBoundariesExample() {
  const copy = useStoryTranslations(translations);
  return (
    <Surface style={{ padding: '1.25rem' }}>
      <h2 style={{ marginTop: 0 }}>{copy.platformTitle}</h2>
      <SafeArea
        edges={['top', 'bottom']}
        style={{ border: '1px solid var(--ec-color-border)', borderRadius: 'var(--ec-radius-lg)' }}
      >
        {copy.safeArea}
      </SafeArea>
      <div style={{ marginTop: '1rem' }}>
        <AccessGate allowed fallback={copy.accessFallback}>
          {copy.accessAllowed}
        </AccessGate>
      </div>
    </Surface>
  );
}

const meta = {
  title: 'Foundation/Tokens and Theme',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Container style={{ padding: '2rem 0' }}>
          <Story />
        </Container>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Buttons: Story = { render: () => <ButtonsExample /> };
export const GenericDashboard: Story = { render: () => <DashboardExample /> };
export const PlatformBoundaries: Story = { render: () => <PlatformBoundariesExample /> };
