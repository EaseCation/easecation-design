import type * as React from "react"

import { Label } from "../label"
import { cn } from "../../lib/utils"

export function FilterField({
  label,
  children,
  className,
  htmlFor,
  layout = "stack",
}: {
  label: string
  children: React.ReactNode
  className?: string
  htmlFor?: string
  /** stack：标签在上；inline：标签在左 */
  layout?: "stack" | "inline"
}) {
  const labelEl = (
    <Label
      htmlFor={htmlFor}
      className={cn(
        "shrink-0 text-xs leading-none font-medium text-muted-foreground",
        layout === "inline" && "whitespace-nowrap"
      )}
    >
      {label}
    </Label>
  )

  if (layout === "inline") {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)}>
        {labelEl}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    )
  }

  return (
    <div className={cn("grid min-w-0 gap-1.5", className)}>
      {labelEl}
      {children}
    </div>
  )
}
