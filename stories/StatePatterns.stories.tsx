import { ActivityIcon, PlusIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  EmptyState,
  ErrorState,
  ResponsiveGrid,
  SectionCard,
  StatCard,
  ThemeProvider,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    monthlyRevenue: 'Monthly revenue',
    refundRate: 'Refund rate',
    activeTeams: 'Active teams',
    noChange: 'No change',
    library: 'Content library',
    stateDescription: 'Reusable state compositions',
    empty: 'No content yet',
    emptyDescription: 'Create the first reusable entry.',
    create: 'Create',
    error: 'Unable to load',
    errorDescription: 'Check the connection and try again.',
  },
  'zh-CN': {
    monthlyRevenue: '月收入',
    refundRate: '退款率',
    activeTeams: '活跃团队',
    noChange: '无变化',
    library: '内容库',
    stateDescription: '可复用的状态组合',
    empty: '暂无内容',
    emptyDescription: '创建第一条可复用内容。',
    create: '创建',
    error: '加载失败',
    errorDescription: '检查网络连接后重试。',
  },
} as const;

function MetricsExample() {
  const copy = useStoryTranslations(translations);
  return (
    <ResponsiveGrid minColumnWidth="14rem">
      <StatCard
        label={copy.monthlyRevenue}
        value="$286,420"
        delta="18.2%"
        trend="up"
        icon={<ActivityIcon />}
      />
      <StatCard label={copy.refundRate} value="1.08%" delta="0.2%" trend="down" />
      <StatCard label={copy.activeTeams} value="128" delta={copy.noChange} trend="steady" />
    </ResponsiveGrid>
  );
}
function StatesExample() {
  const copy = useStoryTranslations(translations);
  return (
    <SectionCard title={copy.library} description={copy.stateDescription}>
      <ResponsiveGrid>
        <EmptyState
          title={copy.empty}
          description={copy.emptyDescription}
          action={<Button leadingIcon={<PlusIcon />}>{copy.create}</Button>}
        />
        <ErrorState title={copy.error} description={copy.errorDescription} onRetry={() => {}} />
      </ResponsiveGrid>
    </SectionCard>
  );
}

const meta = {
  title: 'Patterns/Feedback and Metrics',
  component: StatCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Metrics: Story = {
  args: { label: '', value: '', delta: '', trend: 'steady' },
  render: () => <MetricsExample />,
};
export const States: Story = {
  args: { label: '', value: '', delta: '', trend: 'steady' },
  render: () => <StatesExample />,
};
