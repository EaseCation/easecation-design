import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium outline-none select-none disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_1px_oklch(0.18_0.02_264/0.08)] hover:bg-primary/92",
        outline:
          "border border-border/70 bg-background text-foreground hover:bg-muted/60 dark:border-input/50 dark:bg-transparent dark:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/75",
        ghost:
          "text-foreground hover:bg-muted/60 dark:hover:bg-muted/35",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/16 dark:bg-destructive/15 dark:hover:bg-destructive/22",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 rounded-md px-3 text-[0.8125rem]",
        xs: "h-6 gap-1 rounded-md px-2 text-xs",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem]",
        lg: "h-9 gap-1.5 rounded-lg px-3.5 text-sm",
        icon: "size-8 rounded-md",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  pressable = true,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** 是否启用卡片式按压倾斜动画；密集操作区建议关闭 */
    pressable?: boolean
  }) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [isPressing, setIsPressing] = React.useState(false)
  const [pressStyle, setPressStyle] = React.useState<React.CSSProperties>({})

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(e)
    if (!pressable || e.defaultPrevented) return

    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const offsetX = ((x - centerX) / centerX) * 15
    const offsetY = ((y - centerY) / centerY) * 15

    setPressStyle({
      "--press-x": `${x}px`,
      "--press-y": `${y}px`,
      "--rotate-x": `${-offsetY}deg`,
      "--rotate-y": `${offsetX}deg`,
    } as React.CSSProperties)
    setIsPressing(true)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerUp?.(e)
    if (!pressable) return
    setIsPressing(false)
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e)
    if (!pressable) return
    setIsPressing(false)
  }

  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      ref={buttonRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, size, className }),
        pressable &&
          "relative overflow-hidden [perspective:600px] transition-all duration-200 ease-out",
        pressable &&
          isPressing &&
          "[transform:perspective(600px)_rotateX(var(--rotate-x))_rotateY(var(--rotate-y))_scale(0.94)]"
      )}
      style={
        (pressable
          ? {
              ...style,
              ...pressStyle,
            }
          : style) as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {!asChild && pressable ? (
        <>
          <span className="relative z-10 flex items-center">
            {children}
          </span>
          <span
            className={cn(
              "absolute inset-0 z-0 pointer-events-none transition-all duration-300",
              isPressing ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `
                radial-gradient(circle 140px at var(--press-x) var(--press-y), rgba(0,0,0,0.35) 0%, transparent 55%),
                radial-gradient(circle 90px at var(--press-x) var(--press-y), rgba(0,0,0,0.25) 0%, transparent 45%)
              `,
              boxShadow: isPressing
                ? `inset 0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)`
                : "none",
            }}
          />
          <span
            className={cn(
              "absolute inset-0 z-[1] pointer-events-none transition-opacity duration-200",
              isPressing ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(circle 50px at var(--press-x) var(--press-y), rgba(255,255,255,0.2), transparent 50%)`,
            }}
          />
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
