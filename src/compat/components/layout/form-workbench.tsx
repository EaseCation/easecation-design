import type * as React from "react"

import { cn } from "../../lib/utils"

export interface FormWorkbenchProps extends React.ComponentProps<"div"> {
  aside?: React.ReactNode
  footer?: React.ReactNode
}

export function FormWorkbench({
  aside,
  footer,
  className,
  children,
  ...props
}: FormWorkbenchProps) {
  return (
    <div
      className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]", className)}
      {...props}
    >
      <div className="grid gap-4">
        {children}
        {footer ? (
          <div className="sticky bottom-3 z-10 rounded-xl border border-border/40 bg-panel/90 p-3 shadow-[var(--shadow-lg)] backdrop-blur-xl">
            {footer}
          </div>
        ) : null}
      </div>
      {aside ? (
        <aside className="grid content-start gap-4">{aside}</aside>
      ) : null}
    </div>
  )
}
