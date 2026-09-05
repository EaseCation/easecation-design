import type * as React from 'react';

import { cn } from '../../lib/utils';

import {
  createFilterEnterSearchHandler,
  FILTER_BAR_FIELD_CONTROLS_CLASS,
} from './toolbar-controls';

export interface FilterBarProps extends React.ComponentProps<'div'> {
  actions?: React.ReactNode;
  variant?: 'card' | 'plain';
  onSearch?: () => void;
}

export function FilterBar({
  className,
  actions,
  children,
  variant = 'card',
  onSearch,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-3.5',
        variant === 'card'
          ? 'rounded-xl border border-border/45 bg-card p-4 shadow-none'
          : 'min-w-0',
        className,
      )}
      onKeyDown={createFilterEnterSearchHandler(onSearch)}
      {...props}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-wrap items-end gap-x-4 gap-y-3',
          FILTER_BAR_FIELD_CONTROLS_CLASS,
        )}
      >
        {children}
      </div>
      {actions ? (
        <div className="ml-auto flex shrink-0 flex-nowrap items-center justify-end gap-2 [&_button]:h-9 [&_button]:max-h-9 [&_button]:min-h-9 [&_button]:min-w-[5.5rem] [&_button]:w-auto [&_button]:max-w-none [&_button]:justify-center [&_button]:px-3.5 [&_button]:py-0 [&_button]:shadow-none">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
