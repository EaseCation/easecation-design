import * as React from 'react';

import { cn } from '../lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-md border border-border/70 bg-background px-3 py-2 text-sm transition-all outline-none placeholder:text-muted-foreground/60 hover:border-border focus-visible:border-primary/50 focus-visible:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-destructive/60 dark:border-input/40 dark:bg-input/15 dark:hover:border-input/60',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
