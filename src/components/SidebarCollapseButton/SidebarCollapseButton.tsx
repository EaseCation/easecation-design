import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export interface SidebarCollapseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  collapsed: boolean;
  collapseLabel?: string;
  expandLabel?: string;
}

export const SidebarCollapseButton = forwardRef<HTMLButtonElement, SidebarCollapseButtonProps>(
  function SidebarCollapseButton(
    {
      collapsed,
      collapseLabel = 'Collapse sidebar',
      expandLabel = 'Expand sidebar',
      className,
      type = 'button',
      ...props
    },
    ref,
  ) {
    const label = collapsed ? expandLabel : collapseLabel;
    const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
    return (
      <button
        ref={ref}
        type={type}
        className={['ec-sidebar-collapse', 'ec-sidebar-row', 'ec-focusable', className]
          .filter(Boolean)
          .join(' ')}
        data-collapsed={collapsed || undefined}
        aria-label={label}
        aria-expanded={!collapsed}
        title={label}
        {...props}
      >
        <span className="ec-sidebar-icon" aria-hidden="true">
          <Icon />
        </span>
      </button>
    );
  },
);
