import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Container,
  Flex,
  FormItem,
  Input,
  PageHeader,
  ResponsiveGrid,
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
    metrics: ['Active workspaces', 'Automation tasks', 'Service availability'],
    overview: 'Overview',
    activity: 'Activity log',
    workspaceName: 'Workspace name',
    help: 'The name can be changed at any time.',
    placeholder: 'For example: East operations center',
    noActivity: 'No activity yet',
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
    metrics: ['活跃工作区', '自动化任务', '服务可用率'],
    overview: '概览',
    activity: '活动记录',
    workspaceName: '工作区名称',
    help: '名称可以随时修改。',
    placeholder: '例如：华东运营中心',
    noActivity: '暂无活动记录',
  },
} as const;

function ButtonsExample() {
  const copy = useStoryTranslations(translations);
  return (
    <Flex wrap>
      <Button>{copy.primary}</Button>
      <Button variant="secondary">{copy.secondary}</Button>
      <Button variant="outline">{copy.outline}</Button>
      <Button variant="ghost">{copy.ghost}</Button>
      <Button variant="danger">{copy.danger}</Button>
      <Button loading>{copy.loading}</Button>
    </Flex>
  );
}
function DashboardExample() {
  const copy = useStoryTranslations(translations);
  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={<Button>{copy.createReport}</Button>}
      />
      <ResponsiveGrid>
        {copy.metrics.map((label, index) => (
          <Surface key={label} style={{ padding: '1.25rem' }}>
            <div
              style={{
                fontSize: '.72rem',
                fontWeight: 700,
                color: 'var(--ec-color-text-muted)',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
            <strong style={{ display: 'block', fontSize: '1.8rem', marginTop: '.75rem' }}>
              {['128', '4,862', '99.97%'][index]}
            </strong>
          </Surface>
        ))}
      </ResponsiveGrid>
      <Surface style={{ padding: '1.25rem', marginTop: '1rem' }}>
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
      </Surface>
    </>
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
