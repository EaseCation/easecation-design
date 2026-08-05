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

export function Popover(props: PopoverProps) {
  if ('trigger' in props) {
    const { trigger, children, placement = 'bottom-start', title, className, ...rootProps } = props;
    const [side, align] = placement.split('-') as ['top' | 'bottom', 'start' | 'end'];
    return (
      <Primitive.Root {...rootProps}>
        <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
        <PopoverContent side={side} align={align} className={className}>
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
