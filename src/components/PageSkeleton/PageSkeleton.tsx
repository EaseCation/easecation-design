import { forwardRef, type HTMLAttributes } from 'react';
import { Skeleton } from '../Skeleton';

export interface PageSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

/** A content placeholder, never an overlay. Use Skeleton directly for known data layouts. */
export const PageSkeleton = forwardRef<HTMLDivElement, PageSkeletonProps>(function PageSkeleton(
  { label = 'Loading', className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      aria-label={label}
      className={['ec-page-skeleton', 'ec-page-stack', className].filter(Boolean).join(' ')}
      style={{ padding: 'var(--ec-space-4)', ...style }}
      {...props}
    >
      <Skeleton style={{ height: 'var(--ec-control-md)', width: '40%', maxWidth: '10rem' }} />
      <Skeleton style={{ height: 'var(--ec-font-size-md)', width: '65%', maxWidth: '16rem' }} />
      <Skeleton style={{ height: '12rem', width: '100%' }} />
    </div>
  );
});
