import { Label as Primitive } from 'radix-ui';
import type { ComponentProps } from 'react';
export function Label({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root className={['ec-label', className].filter(Boolean).join(' ')} {...props} />
  );
}
