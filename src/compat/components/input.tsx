import * as React from 'react';

import { cn } from '../lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-8 w-full min-w-0 rounded-md border border-border/70 bg-background px-3 text-sm transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 hover:border-border focus-visible:border-primary/50 focus-visible:shadow-[var(--shadow-glow)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-destructive/60 aria-invalid:focus-visible:shadow-[0_0_0_3px_oklch(0.60_0.24_25/0.12)] dark:border-input/40 dark:bg-input/15 dark:hover:border-input/60 dark:focus-visible:border-primary/50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
