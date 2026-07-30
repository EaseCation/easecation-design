import type * as React from "react"

import {
  ResponsiveOverlay,
  ResponsiveOverlayBody,
  ResponsiveOverlayContent,
  ResponsiveOverlayDescription,
  ResponsiveOverlayFooter,
  ResponsiveOverlayHeader,
  ResponsiveOverlayTitle,
} from "./responsive-overlay"

export interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** 桌面端 DialogContent 额外样式，如放大宽度 */
  desktopContentClassName?: string
  /** 移动端 SheetContent 额外样式，如固定高度 */
  mobileContentClassName?: string
  /** 内容区额外样式 */
  bodyClassName?: string
  /** 跳过开关动画，适合需要即时反馈的操作弹层 */
  instant?: boolean
  /** 关闭时仍挂载内容，便于提前预热 */
  forceMount?: true
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  desktopContentClassName,
  mobileContentClassName,
  bodyClassName,
  instant = false,
  forceMount,
}: ResponsiveDialogProps) {
  return (
    <ResponsiveOverlay open={open} onOpenChange={onOpenChange}>
      <ResponsiveOverlayContent
        className={desktopContentClassName}
        mobileClassName={mobileContentClassName}
        instant={instant}
        forceMount={forceMount}
      >
        <ResponsiveOverlayHeader>
          <ResponsiveOverlayTitle>{title}</ResponsiveOverlayTitle>
          {description ? (
            <ResponsiveOverlayDescription>{description}</ResponsiveOverlayDescription>
          ) : null}
        </ResponsiveOverlayHeader>
        <ResponsiveOverlayBody className={bodyClassName}>{children}</ResponsiveOverlayBody>
        {footer ? (
          <ResponsiveOverlayFooter>{footer}</ResponsiveOverlayFooter>
        ) : null}
      </ResponsiveOverlayContent>
    </ResponsiveOverlay>
  )
}
