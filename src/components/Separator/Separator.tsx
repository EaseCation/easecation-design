import { Separator as Primitive } from 'radix-ui';
import type { ComponentProps } from 'react';
export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      orientation={orientation}
      decorative={decorative}
      data-orientation={orientation}
      className={['ec-separator', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
