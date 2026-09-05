import type * as React from 'react';
import { AlertTriangleIcon } from 'lucide-react';

import { Button } from '../button';
import { cn } from '../../lib/utils';

export interface ErrorStateProps extends React.ComponentProps<'div'> {
  title: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title,
  description,
  actionLabel = '重试',
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-destructive/15 bg-card p-8 text-center',
        className,
      )}
      {...props}
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="size-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="max-w-md text-[0.8125rem] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
