import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
} from 'react';
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
    children,
    ...props
  },
  ref,
) {
  const inner = useRef<HTMLDivElement>(null);
  const [pressing, setPressing] = useState(false);
  const [pressStyle, setPressStyle] = useState<CSSProperties>({});
  useImperativeHandle(ref, () => inner.current as HTMLDivElement);
  const start = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (!pressable || !inner.current) return;
    const rect = inner.current.getBoundingClientRect();
    const x = event.clientX - rect.left,
      y = event.clientY - rect.top;
    const offsetX = ((x - rect.width / 2) / (rect.width / 2 || 1)) * 8,
      offsetY = ((y - rect.height / 2) / (rect.height / 2 || 1)) * 8;
    setPressStyle({
      '--press-x': `${x}px`,
      '--press-y': `${y}px`,
      '--rotate-x': `${-offsetY}deg`,
      '--rotate-y': `${offsetX}deg`,
    } as CSSProperties);
    setPressing(true);
  };
  const end = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    setPressing(false);
  };
  const leave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    setPressing(false);
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
