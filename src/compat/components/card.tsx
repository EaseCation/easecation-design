import * as React from 'react';

import { cn } from '../lib/utils';

function Card({
  className,
  size = 'default',
  pressable = false,
  ...props
}: React.ComponentProps<'div'> & {
  size?: 'default' | 'sm';
  pressable?: boolean;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isPressing, setIsPressing] = React.useState(false);
  const [pressStyle, setPressStyle] = React.useState<React.CSSProperties>({});

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pressable) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offsetX = ((x - centerX) / centerX) * 8;
    const offsetY = ((y - centerY) / centerY) * 8;

    setPressStyle({
      '--press-x': `${x}px`,
      '--press-y': `${y}px`,
      '--rotate-x': `${-offsetY}deg`,
      '--rotate-y': `${offsetX}deg`,
    } as React.CSSProperties);
    setIsPressing(true);
  };

  const handlePointerUp = () => {
    setIsPressing(false);
  };

  const handlePointerLeave = () => {
    setIsPressing(false);
  };

  return (
    <div
      ref={cardRef}
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-border/50 data-[size=sm]:py-3 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        'gap-4 py-4 data-[size=sm]:gap-3',
        pressable && [
          'cursor-pointer [perspective:600px] transition-all duration-200 ease-out',
          isPressing &&
            '[transform:perspective(600px)_rotateX(var(--rotate-x))_rotateY(var(--rotate-y))_scale(0.97)]',
        ],
        className,
      )}
      style={
        {
          ...props.style,
          ...pressStyle,
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {props.children}
      {pressable && (
        <>
          <span
            className={cn(
              'absolute inset-0 z-0 pointer-events-none transition-all duration-300',
              isPressing ? 'opacity-100' : 'opacity-0',
            )}
            style={{
              background: `
                radial-gradient(circle 200px at var(--press-x) var(--press-y), rgba(0,0,0,0.2) 0%, transparent 60%),
                radial-gradient(circle 120px at var(--press-x) var(--press-y), rgba(0,0,0,0.15) 0%, transparent 50%)
              `,
              boxShadow: isPressing
                ? `inset 0 3px 10px rgba(0,0,0,0.2), inset 0 1px 3px rgba(0,0,0,0.15)`
                : 'none',
            }}
          />
          <span
            className={cn(
              'absolute inset-0 z-[1] pointer-events-none transition-opacity duration-200',
              isPressing ? 'opacity-100' : 'opacity-0',
            )}
            style={{
              background: `radial-gradient(circle 80px at var(--press-x) var(--press-y), rgba(255,255,255,0.12), transparent 50%)`,
            }}
          />
        </>
      )}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-5 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'text-[0.9375rem] leading-snug font-semibold tracking-[-0.01em] group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-[0.8125rem] text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-5 group-data-[size=sm]/card:px-4', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center border-t border-border/40 bg-muted/30 px-5 py-3 group-data-[size=sm]/card:px-4',
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
