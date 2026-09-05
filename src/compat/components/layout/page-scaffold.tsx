import type * as React from 'react';

import { cn } from '../../lib/utils';

export interface PageScaffoldProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: React.ReactNode;
  titleIcon?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageScaffold({
  title,
  titleIcon,
  eyebrow,
  actions,
  className,
  children,
  ...props
}: PageScaffoldProps) {
  return (
    <section className={cn('page-gutter page-stack py-5 sm:py-7', className)} {...props}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          {eyebrow ? (
            <p className="text-[0.6875rem] font-medium tracking-widest text-primary/70 uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
            {titleIcon}
            {title}
          </h1>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}
