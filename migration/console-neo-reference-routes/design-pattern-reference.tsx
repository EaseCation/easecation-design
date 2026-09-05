import { ActivityIcon, PlusIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { Input } from '@workspace/ui/components/input';
import { ActionBar } from '@workspace/ui/components/layout/action-bar';
import { FilterBar } from '@workspace/ui/components/patterns/filter-bar';
import { FilterField } from '@workspace/ui/components/patterns/filter-field';
import { SectionCard } from '@workspace/ui/components/patterns/section-card';
import { StatCard } from '@workspace/ui/components/patterns/stat-card';
import { EmptyState } from '@workspace/ui/components/state/empty-state';
import { ErrorState } from '@workspace/ui/components/state/error-state';

export default function DesignPatternReference() {
  return (
    <main className="min-h-svh bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header>
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Console Neo Pattern Reference
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">复合组件迁移基线</h1>
          <p className="mt-1 text-sm text-muted-foreground">状态、筛选、指标卡与页面操作区域。</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
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
            <p className="text-sm font-medium">已选择 3 项</p>
            <p className="text-xs text-muted-foreground">可以执行批量操作</p>
          </div>
          <Button size="sm">批量处理</Button>
        </ActionBar>
        <SectionCard title="内容库" description="领域中立的空状态和错误状态。">
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState
              title="暂无内容"
              description="创建第一条可复用内容。"
              action={
                <Button>
                  <PlusIcon />
                  创建内容
                </Button>
              }
            />
            <ErrorState title="加载失败" description="检查网络连接后重试。" onRetry={() => {}} />
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
