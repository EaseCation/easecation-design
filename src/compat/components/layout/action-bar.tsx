import type * as React from 'react';

import { cn } from '../../lib/utils';

export function ActionBar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border/40 bg-card p-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    />
  );
}
