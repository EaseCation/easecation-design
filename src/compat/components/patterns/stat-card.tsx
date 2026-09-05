import type * as React from 'react';
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

export interface StatCardProps extends React.ComponentProps<'article'> {
  label: string;
  value: string;
  delta: string;
  hint?: string;
  trend: 'up' | 'down' | 'steady';
  icon?: React.ReactNode;
}

const trendIcon = {
  up: <ArrowUpRightIcon className="size-3.5" />,
  down: <ArrowDownRightIcon className="size-3.5" />,
  steady: <ArrowRightIcon className="size-3.5" />,
};

const trendClass = {
  up: 'text-success',
  down: 'text-danger',
  steady: 'text-muted-foreground',
};

export function StatCard({
  label,
  value,
  delta,
  hint,
  trend,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <article
      className={cn(
        'group/stat relative overflow-hidden rounded-xl border border-border/40 bg-card p-5 text-card-foreground transition-all duration-[var(--motion-base)] hover:border-border/60',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-[0.6875rem] font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
          <div className="space-y-1.5">
            <p className="text-[1.75rem] font-bold tracking-[-0.02em] leading-none">{value}</p>
            <div
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium',
                trendClass[trend],
              )}
            >
              {trendIcon[trend]}
              <span>{delta}</span>
            </div>
          </div>
        </div>
        {icon ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary transition-colors group-hover/stat:bg-primary/12">
            {icon}
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-4 truncate text-xs text-muted-foreground">{hint}</p> : null}
    </article>
  );
}
