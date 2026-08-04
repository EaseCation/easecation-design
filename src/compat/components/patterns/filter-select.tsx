"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"
import { cn } from "../../lib/utils"

import {
  TOOLBAR_FIELD_HEIGHT_CLASS,
  TOOLBAR_FILTER_MENU_WIDTH_CLASS,
  TOOLBAR_FILTER_TRIGGER_WIDTH_CLASS,
} from "./toolbar-controls"

const EMPTY_VALUE = "__empty__"

export type FilterSelectOption = {
  value: string
  label: string
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder = "请选择",
  className,
  triggerClassName,
  disabled,
  "aria-label": ariaLabel,
}: {
  value: string
  onValueChange: (value: string) => void
  options: FilterSelectOption[]
  placeholder?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
  "aria-label"?: string
}) {
  const selectValue = value === "" ? EMPTY_VALUE : value
  const [open, setOpen] = React.useState(false)
  const startXRef = React.useRef(0)
  const startYRef = React.useRef(0)
  const isSwipeRef = React.useRef(false)

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    isSwipeRef.current = false
    e.preventDefault()
  }, [])

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return
    const dx = Math.abs(e.clientX - startXRef.current)
    const dy = Math.abs(e.clientY - startYRef.current)
    if (dx > 5 || dy > 5) {
      isSwipeRef.current = true
    }
  }, [])

  const handlePointerUp = React.useCallback(() => {
    if (!isSwipeRef.current) {
      setOpen((prev) => !prev)
    }
    isSwipeRef.current = false
  }, [])

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
    },
    []
  )

  return (
    <Select
      disabled={disabled}
      open={open}
      onOpenChange={handleOpenChange}
      value={selectValue}
      onValueChange={(next) => onValueChange(next === EMPTY_VALUE ? "" : next)}
    >
      <SelectTrigger
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
          TOOLBAR_FIELD_HEIGHT_CLASS,
          TOOLBAR_FILTER_TRIGGER_WIDTH_CLASS,
          "bg-background px-2.5 font-normal shadow-none touch-manipulation",
          "data-[size=default]:!h-9 data-[size=sm]:!h-9",
          triggerClassName,
          className
        )}
        aria-label={ariaLabel}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="bottom"
        align="start"
        sideOffset={4}
        collisionPadding={12}
        className={cn("z-[200]", TOOLBAR_FILTER_MENU_WIDTH_CLASS)}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value || EMPTY_VALUE}
            value={option.value === "" ? EMPTY_VALUE : option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
