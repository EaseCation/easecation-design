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
      className={cn("ec-form-workbench", className)}
      {...props}
    >
      <div className="ec-form-workbench__main">
        {children}
        {footer ? <div className="ec-form-workbench__footer">{footer}</div> : null}
      </div>
      {aside ? <aside className="ec-form-workbench__aside">{aside}</aside> : null}
    </div>
  )
}
