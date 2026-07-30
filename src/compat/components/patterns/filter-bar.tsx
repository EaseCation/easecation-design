import type * as React from "react"

import { cn } from "../../lib/utils"

import {
  createFilterEnterSearchHandler,
  FILTER_BAR_FIELD_CONTROLS_CLASS,
} from "./toolbar-controls"

export interface FilterBarProps extends React.ComponentProps<"div"> {
  actions?: React.ReactNode
  variant?: "card" | "plain"
  onSearch?: () => void
}

export function FilterBar({
  className,
  actions,
  children,
  variant = "card",
  onSearch,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:justify-between",
        variant === "card"
          ? "rounded-xl border border-border/40 bg-card p-3"
          : "min-w-0",
        className
      )}
      onKeyDown={createFilterEnterSearchHandler(onSearch)}
      {...props}
    >
      <div
        className={cn(
          "grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4 items-start",
          FILTER_BAR_FIELD_CONTROLS_CLASS
        )}
      >
        {children}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 [&_button]:h-8 [&_button]:max-h-8 [&_button]:min-h-8 [&_button]:py-0">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
