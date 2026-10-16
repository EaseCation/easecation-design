import { forwardRef, type HTMLAttributes, type Key } from 'react';

export interface PageTransitionProps extends HTMLAttributes<HTMLDivElement> {
  /** The host router owns this key; changing it restarts entry and resets page children. */
  transitionKey?: Key;
}

export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  function PageTransition({ transitionKey, className, ...props }, ref) {
    return (
      <div
        key={transitionKey}
        ref={ref}
        className={['ec-route-transition-enter', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
