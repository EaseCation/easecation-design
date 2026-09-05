import { forwardRef, type HTMLAttributes } from 'react';
export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Skeleton({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={['ec-skeleton', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
