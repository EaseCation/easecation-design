import type * as React from "react"

import { cn } from "../../lib/utils"

/** 筛选工具栏：下拉、输入、按钮统一高度（36px） */
export const TOOLBAR_FIELD_HEIGHT_CLASS = "h-9 min-h-9 max-h-9 py-0"

/** 带图标的工具栏按钮 */
export const TOOLBAR_BUTTON_HEIGHT_CLASS = "h-9 min-h-9 max-h-9 gap-1.5 py-0"

/** 在筛选输入框按 Enter 时触发查询 */
export function createFilterEnterSearchHandler(
  onSearch?: () => void
): React.KeyboardEventHandler<HTMLElement> {
  return (event) => {
    if (!onSearch || event.key !== "Enter" || event.defaultPrevented) return
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    if (target.type === "button" || target.type === "submit") return
    event.preventDefault()
    onSearch()
  }
}

/** 原生 select 与 FilterSelect / Input 对齐时使用 */
export const TOOLBAR_NATIVE_SELECT_CLASS = cn(
  TOOLBAR_FIELD_HEIGHT_CLASS,
  "rounded-lg border border-input bg-background px-3 text-sm"
)

/** FilterBar 内 Input / 原生 select / datetime-local 统一高度与宽度 */
export const FILTER_BAR_FIELD_CONTROLS_CLASS = cn(
  "[&_[data-slot=input]]:h-9 [&_[data-slot=input]]:max-h-9 [&_[data-slot=input]]:min-h-9 [&_[data-slot=input]]:py-0",
  "[&_select]:h-9 [&_select]:max-h-9 [&_select]:min-h-9 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-input [&_select]:bg-background [&_select]:px-3 [&_select]:py-0 [&_select]:text-sm",
  "[&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:h-9 [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:max-h-9 [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:min-h-9 [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:w-full [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:rounded-lg [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:border [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:border-input [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:bg-background [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:px-3 [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:py-0 [&_input:not([type=checkbox]):not([type=radio]):not([data-slot=input])]:text-sm",
  "[&_button]:h-9 [&_button]:max-h-9 [&_button]:min-h-9 [&_button]:w-full [&_button]:max-w-none [&_button]:justify-start [&_button]:shadow-none",
  "[&_[data-slot=select-trigger]]:h-9 [&_[data-slot=select-trigger]]:max-h-9 [&_[data-slot=select-trigger]]:min-h-9 [&_[data-slot=select-trigger]]:w-full [&_[data-slot=select-trigger]]:max-w-none"
)

/** 筛选下拉触发器固定宽度，避免选中项文案变化导致布局抖动 */
export const TOOLBAR_FILTER_TRIGGER_WIDTH_CLASS = "w-[10.5rem] max-w-[10.5rem] shrink-0"

/** 筛选下拉面板固定宽度（略宽于触发器，容纳较长选项文案） */
export const TOOLBAR_FILTER_MENU_WIDTH_CLASS = "w-56 max-w-56"
