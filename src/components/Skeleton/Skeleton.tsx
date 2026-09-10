import { forwardRef, type HTMLAttributes } from 'react';

export type SkeletonRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  radius?: SkeletonRadius;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { radius = 'lg', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-radius={radius}
      className={['ec-skeleton', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
