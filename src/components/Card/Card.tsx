import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type PointerEvent,
} from 'react';
import { usePressFeedback } from '../../hooks/usePressFeedback';
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md';
  pressable?: boolean;
}
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    size = 'md',
    pressable = false,
    className,
    style,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onLostPointerCapture,
    children,
    ...props
  },
  ref,
) {
  const inner = useRef<HTMLDivElement>(null);
  const {
    pressing,
    pressStyle,
    start: startPress,
    end: endPress,
    release: releasePress,
    cancelHeld,
  } = usePressFeedback(pressable, 8);
  useImperativeHandle(ref, () => inner.current as HTMLDivElement);
  const start = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    startPress(event);
  };
  const end = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    releasePress();
  };
  const leave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    cancelHeld();
  };
  const cancel = (event: PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);
    endPress();
  };
  const lostCapture = (event: PointerEvent<HTMLDivElement>) => {
    onLostPointerCapture?.(event);
    cancelHeld();
  };
  return (
    <div
      ref={inner}
      data-size={size}
      className={[
        'ec-card',
        pressable && 'ec-card--pressable',
        pressing && 'is-pressing',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, ...pressStyle }}
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={leave}
      onPointerCancel={cancel}
      onLostPointerCapture={lostCapture}
      {...props}
    >
      <div className="ec-card__content-layer">{children}</div>
      {pressable ? (
        <>
          <span className="ec-card__press-shade" />
          <span className="ec-card__press-light" />
        </>
      ) : null}
    </div>
  );
});
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={['ec-card__header', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
export const CardTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={['ec-card__title', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
export const CardDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardDescription({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={['ec-card__description', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
export const CardAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardAction({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={['ec-card__action', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={['ec-card__body', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={['ec-card__footer', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
