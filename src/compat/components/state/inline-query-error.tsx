import type * as React from 'react';
import { AlertTriangleIcon } from 'lucide-react';

import { Button } from '../button';
import { cn } from '../../lib/utils';

export interface InlineQueryErrorProps extends React.ComponentProps<'div'> {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  embedded?: boolean;
}

export function InlineQueryError({
  title = '加载失败',
  description,
  actionLabel = '重试',
  onRetry,
  embedded = false,
  className,
  ...props
}: InlineQueryErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-2.5 px-4 py-10 text-center',
        embedded ? 'min-h-40' : 'min-h-40 rounded-xl border border-destructive/15 bg-card',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangleIcon className="size-4 shrink-0" aria-hidden />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {description ? (
        <p className="max-w-md text-[0.8125rem] text-muted-foreground">{description}</p>
      ) : null}
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
