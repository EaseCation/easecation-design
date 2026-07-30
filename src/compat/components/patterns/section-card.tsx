import type * as React from "react"

import { cn } from "../../lib/utils"

export interface SectionCardProps extends React.ComponentProps<"section"> {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function SectionCard({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border/40 bg-card",
        className
      )}
      {...props}
    >
      <header className="flex flex-col gap-3 border-b border-border/30 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-0.5">
          <h2 className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
            {title}
          </h2>
          {description ? (
            <p className="text-[0.8125rem] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
