import { Popover as Primitive } from 'radix-ui';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

const classes = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

export type PopoverProps =
  | ComponentProps<typeof Primitive.Root>
  | {
      trigger: ReactElement;
      children: ReactNode;
      open?: boolean;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
      placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
      title?: ReactNode;
      className?: string;
    };

function resolvePlacement(placement: NonNullable<Extract<PopoverProps, { trigger: ReactElement }>['placement']> | string) {
  const normalized = String(placement)
    .replace('Left', '-start')
    .replace('Right', '-end')
    .replace('Top', '-top')
    .replace('Bottom', '-bottom')
    .toLowerCase();
  const [rawSide, rawAlign] = normalized.split('-');
  const side = ['top', 'right', 'bottom', 'left'].includes(rawSide) ? rawSide : 'bottom';
  const align = ['start', 'center', 'end'].includes(rawAlign) ? rawAlign : 'start';
  return { side: side as 'top' | 'right' | 'bottom' | 'left', align: align as 'start' | 'center' | 'end' };
}

export function Popover(props: PopoverProps) {
  if ('trigger' in props) {
    const { trigger, children, placement = 'bottom-start', title, className, ...rootProps } = props;
    const { side, align } = resolvePlacement(placement);
    return (
      <Primitive.Root {...rootProps}>
        <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
        <PopoverContent side={side} align={align} className={className} collisionPadding={8}>
          {title ? <header>{title}</header> : null}
          <div className="ec-popover-content__body">{children}</div>
        </PopoverContent>
      </Primitive.Root>
    );
  }
  return <Primitive.Root {...props} />;
}

export function PopoverTrigger(props: ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Trigger {...props} />;
}
export function PopoverAnchor(props: ComponentProps<typeof Primitive.Anchor>) {
  return <Primitive.Anchor {...props} />;
}
export function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  const { resolvedMode } = useTheme();
  return (
    <Primitive.Portal>
      <Primitive.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={8}
        data-ec-theme={resolvedMode}
        className={classes(
          'ec-popover-content',
          resolvedMode === 'dark' ? 'dark' : undefined,
          className,
        )}
        {...props}
      />
    </Primitive.Portal>
  );
}
