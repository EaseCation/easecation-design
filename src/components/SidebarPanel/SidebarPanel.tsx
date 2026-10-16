import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { SidebarCollapseButton } from '../SidebarCollapseButton';

export interface SidebarPanelProps extends HTMLAttributes<HTMLDivElement> {
  brand: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseLabel?: string;
  expandLabel?: string;
}

export const SidebarPanel = forwardRef<HTMLDivElement, SidebarPanelProps>(function SidebarPanel(
  {
    brand,
    footer,
    collapsed = false,
    onCollapsedChange,
    collapseLabel,
    expandLabel,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['ec-sidebar-panel', className].filter(Boolean).join(' ')}
      data-collapsed={collapsed || undefined}
      data-native-safe-sidebar-top=""
      {...props}
    >
      <div className="ec-sidebar-panel__brand">{brand}</div>
      <div className="ec-sidebar-panel__navigation">{children}</div>
      {footer || onCollapsedChange ? (
        <div className="ec-sidebar-panel__footer">
          {onCollapsedChange ? (
            <SidebarCollapseButton
              collapsed={collapsed}
              collapseLabel={collapseLabel}
              expandLabel={expandLabel}
              onClick={() => onCollapsedChange(!collapsed)}
            />
          ) : null}
          {footer}
        </div>
      ) : null}
    </div>
  );
});
