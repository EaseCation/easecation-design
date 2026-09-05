import type * as React from 'react';
import { InboxIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

export interface EmptyStateProps extends React.ComponentProps<'div'> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-border/40 bg-card p-8 text-center',
        className,
      )}
      {...props}
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
        {icon ?? <InboxIcon className="size-5" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="max-w-md text-[0.8125rem] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
