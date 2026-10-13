import { createPortal } from 'react-dom';
import { useTheme } from '../../theme/ThemeProvider';
import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
export interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}
export const Surface = forwardRef<HTMLElement, BoxProps>(function Surface(
  { as: Comp = 'div', className, ...props },
  ref,
) {
  return (
    <Comp ref={ref} className={['ec-surface', className].filter(Boolean).join(' ')} {...props} />
  );
});
export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Container({ className, ...props }, ref) {
    return (
      <div ref={ref} className={['ec-container', className].filter(Boolean).join(' ')} {...props} />
    );
  },
);
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: number | string;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
}
export const Flex = forwardRef<HTMLDivElement, StackProps>(function Flex(
  {
    direction = 'row',
    gap = 'var(--ec-space-3)',
    align,
    justify,
    wrap,
    className,
    style,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['ec-flex', className].filter(Boolean).join(' ')}
      style={{
        ...style,
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
      }}
      {...props}
    />
  );
});
export const Space = Flex;
export function Divider({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHRElement> & { children?: ReactNode }) {
  return children ? (
    <div className={['ec-divider', 'ec-divider--with-text', className].filter(Boolean).join(' ')}>
      <span>{children}</span>
    </div>
  ) : (
    <hr className={['ec-divider', className].filter(Boolean).join(' ')} {...props} />
  );
}
export function Portal({
  children,
  container,
}: {
  children: ReactNode;
  container?: Element | null;
}) {
  const { portalContainer } = useTheme();
  if (typeof document === 'undefined') return null;
  return createPortal(children, container ?? portalContainer ?? document.body);
}
