"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "../button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu"
import { cn } from "../../lib/utils"

import { FilterSelect, type FilterSelectOption } from "./filter-select"
import {
  TOOLBAR_FIELD_HEIGHT_CLASS,
  TOOLBAR_FILTER_MENU_WIDTH_CLASS,
  TOOLBAR_FILTER_TRIGGER_WIDTH_CLASS,
} from "./toolbar-controls"

function usePreventSwipeOpen() {
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

  return { handlePointerDown, handlePointerMove, isSwipeRef }
}

export type FilterPickerOption = FilterSelectOption

type FilterPickerBaseProps = {
  options: FilterPickerOption[]
  placeholder?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
  "aria-label"?: string
}

export type FilterPickerSingleProps = FilterPickerBaseProps & {
  mode?: "single"
  value: string
  onValueChange: (value: string) => void
}

export type FilterPickerMultipleProps = FilterPickerBaseProps & {
  mode: "multiple"
  value: string[]
  onValueChange: (value: string[]) => void
}

export type FilterPickerProps =
  | FilterPickerSingleProps
  | FilterPickerMultipleProps

function selectableOptions(options: FilterPickerOption[]) {
  return options.filter((option) => option.value !== "")
}

function resolveOptionLabel(
  options: FilterPickerOption[],
  value: string
): string {
  return options.find((option) => option.value === value)?.label ?? value
}

function FilterPickerMultiple({
  value,
  onValueChange,
  options,
  placeholder = "请选择",
  className,
  triggerClassName,
  disabled,
  "aria-label": ariaLabel,
}: FilterPickerMultipleProps) {
  const items = selectableOptions(options)
  const { handlePointerDown, handlePointerMove, isSwipeRef } = usePreventSwipeOpen()
  const [open, setOpen] = React.useState(false)

  const triggerLabel = React.useMemo(() => {
    if (value.length === 0) return placeholder
    if (value.length === 1) return resolveOptionLabel(options, value[0]!)
    return `已选 ${value.length} 项`
  }, [options, placeholder, value])

  const toggleValue = (optionValue: string, checked: boolean) => {
    if (checked) {
      onValueChange([...value, optionValue])
      return
    }
    onValueChange(value.filter((item) => item !== optionValue))
  }

  const handlePointerUp = React.useCallback(() => {
    if (!isSwipeRef.current) {
      setOpen((prev) => !prev)
    }
    isSwipeRef.current = false
  }, [isSwipeRef])

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
    },
    []
  )

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={cn(
            TOOLBAR_FIELD_HEIGHT_CLASS,
            TOOLBAR_FILTER_TRIGGER_WIDTH_CLASS,
            "justify-between gap-1 bg-background px-2.5 font-normal touch-manipulation",
            className,
            triggerClassName
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {triggerLabel}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          "z-[200] max-h-64 overflow-y-auto",
          TOOLBAR_FILTER_MENU_WIDTH_CLASS
        )}
      >
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            onValueChange([])
          }}
        >
          全部
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {items.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) =>
              toggleValue(option.value, checked === true)
            }
            onSelect={(event) => event.preventDefault()}
          >
            <span className="truncate" title={option.label}>
              {option.label}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function FilterPicker(props: FilterPickerProps) {
  if (props.mode === "multiple") {
    return <FilterPickerMultiple {...props} />
  }

  return (
    <FilterSelect
      value={props.value}
      onValueChange={props.onValueChange}
      options={props.options}
      placeholder={props.placeholder}
      className={props.className}
      triggerClassName={props.triggerClassName}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
    />
  )
}
