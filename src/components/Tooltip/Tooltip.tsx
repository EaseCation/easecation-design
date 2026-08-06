import { Tooltip as Primitive } from 'radix-ui';
import { useEffect, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

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
      disableTouch?: boolean;
      open?: boolean;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
    };

function isCoarsePointer() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(hover: none), (pointer: coarse)').matches ?? false;
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(isCoarsePointer);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setCoarse(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return coarse;
}

export function Tooltip(props: TooltipProps) {
  const coarsePointer = useCoarsePointer();
  if ('content' in props) {
    const {
      content,
      children,
      placement = 'top',
      delay = 300,
      disabled = false,
      disableTouch = true,
      ...rootProps
    } = props;
    if (disabled || (disableTouch && coarsePointer)) return children;
    return (
      <TooltipProvider delayDuration={delay}>
        <Primitive.Root {...rootProps} disableHoverableContent>
          <Primitive.Trigger asChild>{children}</Primitive.Trigger>
          <TooltipContent side={placement} collisionPadding={8}>
            {content}
          </TooltipContent>
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
  const { resolvedMode } = useTheme();
  return (
    <Primitive.Portal>
      <Primitive.Content
        sideOffset={sideOffset}
        data-ec-theme={resolvedMode}
        className={classes(
          'ec-tooltip-content',
          resolvedMode === 'dark' ? 'dark' : undefined,
          className,
        )}
        {...props}
      >
        {children}
        <Primitive.Arrow className="ec-tooltip-arrow" />
      </Primitive.Content>
    </Primitive.Portal>
  );
}
