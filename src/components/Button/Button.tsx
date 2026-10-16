import {
  forwardRef,
  useImperativeHandle,
  useRef,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type SyntheticEvent,
  type PointerEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { Slot } from 'radix-ui';
import { Spinner } from '../Spinner';
import { usePressFeedback } from '../../hooks/usePressFeedback';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonTone = 'default' | 'accent' | 'danger' | 'muted';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ButtonSize =
  ComponentSize | 'xs' | 'xl' | 'inline' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
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
    tone = 'default',
    size = 'md',
    loading = false,
    block = false,
    leadingIcon,
    trailingIcon,
    pressable = true,
    asChild = false,
    className,
    children,
    disabled,
    type = 'button',
    style,
    onClick,
    onBlur,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onLostPointerCapture,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLButtonElement>(null);
  const {
    pressing,
    pressStyle,
    start: startPress,
    end: endPress,
    release: releasePress,
    cancelHeld,
    activate,
  } = usePressFeedback(pressable && !disabled && !loading, 8);
  useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement);
  const start = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(event);
    startPress(event);
  };
  const end = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerUp?.(event);
    releasePress();
  };
  const leave = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event);
    cancelHeld();
  };
  const cancel = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerCancel?.(event);
    endPress();
  };
  const lostCapture = (event: PointerEvent<HTMLButtonElement>) => {
    onLostPointerCapture?.(event);
    cancelHeld();
  };
  const click = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    if (event.defaultPrevented) return;
    onClick?.(event);
    if (!event.defaultPrevented && event.detail === 0) activate(event.currentTarget);
  };
  const blur: NonNullable<ButtonProps['onBlur']> = (event) => {
    onBlur?.(event);
    cancelHeld();
  };
  const buttonClassName = [
    'ec-button',
    'ec-focusable',
    `ec-button--${variant}`,
    tone !== 'default' && `ec-button--tone-${tone}`,
    `ec-button--${size}`,
    block && 'ec-button--block',
    pressable && 'ec-button--pressable',
    pressing && 'is-pressing',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (asChild) {
    // Slot runs child handlers first: intercept on the child itself before composing.
    const block = (event: SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const slottedChild =
      (disabled || loading) && isValidElement(children)
        ? cloneElement(children as ReactElement<HTMLAttributes<HTMLElement>>, {
            onClick: block,
            onClickCapture: block,
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') block(event);
            },
            onKeyDownCapture: (event) => {
              if (event.key === 'Enter' || event.key === ' ') block(event);
            },
            onKeyUp: (event) => {
              if (event.key === 'Enter' || event.key === ' ') block(event);
            },
            tabIndex: -1,
            'aria-disabled': true,
          })
        : children;
    return (
      <Slot.Root
        {...props}
        onClickCapture={disabled || loading ? block : props.onClickCapture}
        onKeyDownCapture={
          disabled || loading
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') block(event);
              }
            : props.onKeyDownCapture
        }
        onKeyUpCapture={
          disabled || loading
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') block(event);
              }
            : props.onKeyUpCapture
        }
        ref={innerRef}
        data-size={size}
        className={buttonClassName}
        style={{ ...style, ...pressStyle }}
        aria-disabled={disabled || loading || undefined}
        aria-busy={loading || undefined}
        onClick={click}
        onBlur={blur}
        onPointerDown={start}
        onPointerUp={end}
        onPointerLeave={leave}
        onPointerCancel={cancel}
        onLostPointerCapture={lostCapture}
      >
        {slottedChild}
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
      onClick={click}
      onBlur={blur}
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={leave}
      onPointerCancel={cancel}
      onLostPointerCapture={lostCapture}
      {...props}
    >
      <span className="ec-button__content">
        {loading ? (
          <Spinner />
        ) : leadingIcon ? (
          <span className="ec-button__icon">{leadingIcon}</span>
        ) : null}
        {children}
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
