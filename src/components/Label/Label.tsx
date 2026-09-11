import { Label as Primitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../../utils/classNames';
export function Label({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root className={cn('ec-label', className)} {...props} />;
}
