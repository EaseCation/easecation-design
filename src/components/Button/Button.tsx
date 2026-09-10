import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type PointerEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { Slot } from 'radix-ui';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ButtonSize = ComponentSize | 'xs' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  pressable?: boolean;
  asChild?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    block = false,
    leadingIcon,
    trailingIcon,
    pressable = false,
    asChild = false,
    className,
    children,
    disabled,
    type = 'button',
    style,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLButtonElement>(null);
  const [pressing, setPressing] = useState(false);
  const [pressStyle, setPressStyle] = useState<CSSProperties>({});
  useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement);
  const start = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(event);
    if (!pressable || event.defaultPrevented || !innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const offsetX = ((x - rect.width / 2) / (rect.width / 2 || 1)) * 15;
    const offsetY = ((y - rect.height / 2) / (rect.height / 2 || 1)) * 15;
    setPressStyle({
      '--press-x': `${x}px`,
      '--press-y': `${y}px`,
      '--rotate-x': `${-offsetY}deg`,
      '--rotate-y': `${offsetX}deg`,
    } as CSSProperties);
    setPressing(true);
  };
  const end = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerUp?.(event);
    if (pressable) setPressing(false);
  };
  const leave = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event);
    if (pressable) setPressing(false);
  };
  const hasChildren = children !== undefined && children !== null && children !== false;
  const buttonClassName = [
    'ec-button',
    'ec-focusable',
    `ec-button--${variant}`,
    `ec-button--${size}`,
    block && 'ec-button--block',
    pressable && 'ec-button--pressable',
    pressing && 'is-pressing',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (asChild) {
    return (
      <Slot.Root
        ref={innerRef}
        data-size={size}
        className={buttonClassName}
        style={{ ...style, ...pressStyle }}
        aria-disabled={disabled || loading || undefined}
        aria-busy={loading || undefined}
        onClick={(event) => {
          if (disabled || loading) {
            event.preventDefault();
            return;
          }
          onClick?.(event as ReactMouseEvent<HTMLButtonElement>);
        }}
        onPointerDown={start}
        onPointerUp={end}
        onPointerLeave={leave}
        {...props}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      ref={innerRef}
      type={type}
      data-size={size}
      className={buttonClassName}
      style={{ ...style, ...pressStyle }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={leave}
      {...props}
    >
      <span className="ec-button__content">
        {loading ? (
          <span className="ec-spinner" aria-hidden="true" />
        ) : leadingIcon ? (
          <span className="ec-button__icon">{leadingIcon}</span>
        ) : null}
        {hasChildren ? <span>{children}</span> : null}
        {trailingIcon ? <span className="ec-button__icon">{trailingIcon}</span> : null}
      </span>
      {pressable ? (
        <>
          <span className="ec-button__press-shade" aria-hidden="true" />
          <span className="ec-button__press-light" aria-hidden="true" />
        </>
      ) : null}
    </button>
  );
});
