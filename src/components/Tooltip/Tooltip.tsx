import { Tooltip as Primitive } from 'radix-ui';
import type { ComponentProps, ReactElement, ReactNode } from 'react';

const classes = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

export function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof Primitive.Provider>) {
  return <Primitive.Provider delayDuration={delayDuration} {...props} />;
}

export type TooltipProps =
  | ComponentProps<typeof Primitive.Root>
  | {
      content: ReactNode;
      children: ReactElement;
      placement?: 'top' | 'bottom' | 'left' | 'right';
      delay?: number;
      disabled?: boolean;
      open?: boolean;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
    };

export function Tooltip(props: TooltipProps) {
  if ('content' in props) {
    const {
      content,
      children,
      placement = 'top',
      delay = 300,
      disabled = false,
      ...rootProps
    } = props;
    return (
      <TooltipProvider delayDuration={delay}>
        <Primitive.Root {...rootProps} disableHoverableContent={disabled}>
          <Primitive.Trigger asChild>{children}</Primitive.Trigger>
          <TooltipContent side={placement}>{content}</TooltipContent>
        </Primitive.Root>
      </TooltipProvider>
    );
  }
  return <Primitive.Root {...props} />;
}

export function TooltipTrigger(props: ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Trigger {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        sideOffset={sideOffset}
        className={classes('ec-tooltip-content', className)}
        {...props}
      >
        {children}
        <Primitive.Arrow className="ec-tooltip-arrow" />
      </Primitive.Content>
    </Primitive.Portal>
  );
}
