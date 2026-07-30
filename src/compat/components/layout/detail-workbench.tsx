import type * as React from "react"

import { cn } from "../../lib/utils"

export interface DetailWorkbenchProps extends React.ComponentProps<"div"> {
  sidebar?: React.ReactNode
}

export function DetailWorkbench({
  sidebar,
  className,
  children,
  ...props
}: DetailWorkbenchProps) {
  return (
    <div
      className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]", className)}
      {...props}
    >
      <div className="grid gap-4">{children}</div>
      {sidebar ? (
        <aside className="grid content-start gap-4">{sidebar}</aside>
      ) : null}
    </div>
  )
}
