import { ActivityIcon, PlusIcon } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActionBar,
  Button,
  Calendar,
  EmptyState,
  ErrorState,
  FilterBar,
  FilterField,
  Input,
  SectionCard,
  StatCard,
  ThemeProvider,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    title: 'Composition reference',
    description: 'States, filters, metric cards, and page actions.',
    revenue: 'Monthly revenue',
    refundRate: 'Refund rate',
    activeTeams: 'Active teams',
    noChange: 'No change',
    reset: 'Reset',
    search: 'Search',
    keyword: 'Keyword',
    report: 'Quarterly report',
    date: 'Date',
    selected: '3 items selected',
    bulkAvailable: 'Bulk actions are available',
    bulkAction: 'Process selected',
    library: 'Content library',
    stateDescription: 'Domain-neutral empty and error states.',
    empty: 'No content yet',
    emptyDescription: 'Create the first reusable entry.',
    create: 'Create content',
    error: 'Unable to load',
    errorDescription: 'Check the connection and try again.',
  },
  'zh-CN': {
    title: '复合组件参考',
    description: '状态、筛选、指标卡与页面操作区域。',
    revenue: '月收入',
    refundRate: '退款率',
    activeTeams: '活跃团队',
    noChange: '无变化',
    reset: '重置',
    search: '查询',
    keyword: '关键词',
    report: '季度报告',
    date: '日期',
    selected: '已选择 3 项',
    bulkAvailable: '可以执行批量操作',
    bulkAction: '批量处理',
    library: '内容库',
    stateDescription: '领域中立的空状态和错误状态。',
    empty: '暂无内容',
    emptyDescription: '创建第一条可复用内容。',
    create: '创建内容',
    error: '加载失败',
    errorDescription: '检查网络连接后重试。',
  },
} as const;

function PatternReference() {
  const copy = useStoryTranslations(translations);
  return (
    <ThemeProvider>
      <main className="ec-component-gallery">
        <div className="ec-pattern-reference-page">
          <header>
            <p className="ec-reference-eyebrow">EaseCation Design Patterns</p>
            <h1 className="ec-reference-title">{copy.title}</h1>
            <p className="ec-reference-description">{copy.description}</p>
          </header>
          <div className="ec-pattern-reference-metrics">
            <StatCard
              label={copy.revenue}
              value="? 286,420"
              delta="18.2%"
              trend="up"
              icon={<ActivityIcon />}
            />
            <StatCard label={copy.refundRate} value="1.08%" delta="0.2%" trend="down" />
            <StatCard label={copy.activeTeams} value="128" delta={copy.noChange} trend="steady" />
          </div>
          <FilterBar
            actions={
              <>
                <Button variant="outline">{copy.reset}</Button>
                <Button>{copy.search}</Button>
              </>
            }
          >
            <FilterField label={copy.keyword}>
              <Input defaultValue={copy.report} />
            </FilterField>
            <FilterField label={copy.date}>
              <Calendar selected={new Date(2026, 6, 28)} labels={{ single: copy.date }} />
            </FilterField>
          </FilterBar>
          <ActionBar>
            <div>
              <p className="ec-reference-action-title">{copy.selected}</p>
              <p className="ec-reference-action-description">{copy.bulkAvailable}</p>
            </div>
            <Button size="sm">{copy.bulkAction}</Button>
          </ActionBar>
          <SectionCard title={copy.library} description={copy.stateDescription}>
            <div className="ec-pattern-reference-states">
              <EmptyState
                title={copy.empty}
                description={copy.emptyDescription}
                action={<Button leadingIcon={<PlusIcon />}>{copy.create}</Button>}
              />
              <ErrorState
                title={copy.error}
                description={copy.errorDescription}
                onRetry={() => {}}
              />
            </div>
          </SectionCard>
        </div>
      </main>
    </ThemeProvider>
  );
}
const meta = {
  title: 'Patterns/Responsive Composition',
  component: SectionCard,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SectionCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Patterns: Story = { args: { title: '' }, render: () => <PatternReference /> };
