import {
  Children,
  cloneElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Slot } from 'radix-ui';
import { ChevronRight } from 'lucide-react';

export interface SidebarNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  level?: 'primary' | 'secondary';
  collapsed?: boolean;
  expanded?: boolean;
  asChild?: boolean;
}

/** A navigation row. Compose with an anchor/router link using asChild. */
export const SidebarNavItem = forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  function SidebarNavItem(
    {
      label,
      icon,
      active = false,
      level = 'primary',
      collapsed = false,
      expanded,
      asChild = false,
      children,
      className,
      type = 'button',
      ...props
    },
    ref,
  ) {
    const content = (
      <>
        {icon ? (
          <span className="ec-sidebar-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {!collapsed ? <span className="ec-sidebar-label">{label}</span> : null}
        {!collapsed && expanded !== undefined ? (
          <ChevronRight className="ec-sidebar-chevron" aria-hidden="true" />
        ) : null}
      </>
    );
    const Component = asChild ? Slot.Root : 'button';
    return (
      <Component
        ref={ref}
        type={asChild ? undefined : type}
        className={['ec-sidebar-nav-item', 'ec-sidebar-row', 'ec-focusable', className]
          .filter(Boolean)
          .join(' ')}
        data-level={level}
        data-active={active || undefined}
        data-collapsed={collapsed || undefined}
        aria-label={collapsed ? label : undefined}
        aria-expanded={expanded}
        {...props}
      >
        {asChild
          ? cloneElement(
              Children.only(children) as ReactElement<{ children?: ReactNode }>,
              {},
              content,
            )
          : content}
      </Component>
    );
  },
);
