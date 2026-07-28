import { ScrollArea as Primitive } from 'radix-ui';
import type { ComponentProps } from 'react';
const classes = (...v: Array<string | undefined>) => v.filter(Boolean).join(' ');
export function ScrollArea({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root className={classes('ec-scroll-area', className)} {...props}>
      <Primitive.Viewport className="ec-scroll-area__viewport">{children}</Primitive.Viewport>
      <ScrollBar />
      <Primitive.Corner />
    </Primitive.Root>
  );
}
export function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<typeof Primitive.ScrollAreaScrollbar>) {
  return (
    <Primitive.ScrollAreaScrollbar
      orientation={orientation}
      data-orientation={orientation}
      className={classes('ec-scrollbar', className)}
      {...props}
    >
      <Primitive.ScrollAreaThumb className="ec-scrollbar__thumb" />
    </Primitive.ScrollAreaScrollbar>
  );
}
