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
function PatternReference() {
  return (
    <ThemeProvider>
      <main className="ec-migration-reference">
        <div className="ec-pattern-reference-page">
          <header>
            <p className="ec-reference-eyebrow">Console Neo Pattern Reference</p>
            <h1 className="ec-reference-title">复合组件迁移基线</h1>
            <p className="ec-reference-description">状态、筛选、指标卡与页面操作区域。</p>
          </header>
          <div className="ec-pattern-reference-metrics">
            <StatCard
              label="月收入"
              value="¥ 286,420"
              delta="18.2%"
              trend="up"
              icon={<ActivityIcon />}
            />
            <StatCard label="退款率" value="1.08%" delta="0.2%" trend="down" />
            <StatCard label="活跃团队" value="128" delta="无变化" trend="steady" />
          </div>
          <FilterBar
            actions={
              <>
                <Button variant="outline">重置</Button>
                <Button>查询</Button>
              </>
            }
          >
            <FilterField label="关键词">
              <Input defaultValue="季度报告" />
            </FilterField>
            <FilterField label="日期">
              <Calendar selected={new Date(2026, 6, 28)} />
            </FilterField>
          </FilterBar>
          <ActionBar>
            <div>
              <p className="ec-reference-action-title">已选择 3 项</p>
              <p className="ec-reference-action-description">可以执行批量操作</p>
            </div>
            <Button size="sm">批量处理</Button>
          </ActionBar>
          <SectionCard title="内容库" description="领域中立的空状态和错误状态。">
            <div className="ec-pattern-reference-states">
              <EmptyState
                title="暂无内容"
                description="创建第一条可复用内容。"
                action={<Button leadingIcon={<PlusIcon />}>创建内容</Button>}
              />
              <ErrorState title="加载失败" description="检查网络连接后重试。" onRetry={() => {}} />
            </div>
          </SectionCard>
        </div>
      </main>
    </ThemeProvider>
  );
}
const meta = {
  title: 'Migration/Pattern Reference Harness',
  component: SectionCard,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SectionCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Patterns: Story = { args: { title: '' }, render: () => <PatternReference /> };
