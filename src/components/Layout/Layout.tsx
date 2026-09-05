import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
export const Layout = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Layout(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={['ec-layout', className].filter(Boolean).join(' ')} {...props} />
  );
});
export const Header = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Header(
  { className, ...props },
  ref,
) {
  return (
    <header ref={ref} className={['ec-header', className].filter(Boolean).join(' ')} {...props} />
  );
});
export const Sidebar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Sidebar(
  { className, ...props },
  ref,
) {
  return (
    <aside ref={ref} className={['ec-sidebar', className].filter(Boolean).join(' ')} {...props} />
  );
});
export const Content = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Content(
  { className, ...props },
  ref,
) {
  return (
    <main ref={ref} className={['ec-content', className].filter(Boolean).join(' ')} {...props} />
  );
});
export const Footer = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Footer(
  { className, ...props },
  ref,
) {
  return (
    <footer ref={ref} className={['ec-footer', className].filter(Boolean).join(' ')} {...props} />
  );
});
export interface SafeAreaProps extends HTMLAttributes<HTMLDivElement> {
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}
export const SafeArea = forwardRef<HTMLDivElement, SafeAreaProps>(function SafeArea(
  { edges = ['top', 'right', 'bottom', 'left'], className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['ec-safe-area', className].filter(Boolean).join(' ')}
      style={{
        ...style,
        paddingTop: edges.includes('top') ? 'var(--ec-safe-top)' : undefined,
        paddingRight: edges.includes('right') ? 'var(--ec-safe-right)' : undefined,
        paddingBottom: edges.includes('bottom') ? 'var(--ec-safe-bottom)' : undefined,
        paddingLeft: edges.includes('left') ? 'var(--ec-safe-left)' : undefined,
      }}
      {...props}
    />
  );
});
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <section className={['ec-page-header', className].filter(Boolean).join(' ')} {...props}>
      <div>
        {eyebrow ? <div className="ec-page-header__eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="ec-page-header__actions">{actions}</div> : null}
    </section>
  );
}
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  minColumnWidth?: string;
  gap?: string;
}
export function ResponsiveGrid({
  minColumnWidth = '16rem',
  gap = 'var(--ec-space-4)',
  style,
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={['ec-grid', className].filter(Boolean).join(' ')}
      style={{
        ...style,
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minColumnWidth}), 1fr))`,
        gap,
      }}
      {...props}
    />
  );
}

export interface NavbarItem extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: ReactNode;
  active?: boolean;
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  brandHref?: string;
  items?: NavbarItem[];
  actions?: ReactNode;
  fixed?: boolean;
  maxWidth?: string;
  menuButton?: ReactNode;
  menuButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  {
    brand,
    brandHref = '#',
    items = [],
    actions,
    fixed = false,
    maxWidth = '76rem',
    menuButton,
    menuButtonProps,
    className,
    style,
    ...props
  },
  ref,
) {
  const {
    className: menuButtonClassName,
    type: menuButtonType,
    ...restMenuButtonProps
  } = menuButtonProps ?? {};

  return (
    <header
      ref={ref}
      className={['ec-navbar', fixed && 'ec-navbar--fixed', className].filter(Boolean).join(' ')}
      style={
        { ...style, '--ec-navbar-max-width': maxWidth } as HTMLAttributes<HTMLElement>['style']
      }
      {...props}
    >
      <div className="ec-navbar__inner">
        <a className="ec-navbar__brand" href={brandHref}>
          {brand}
        </a>
        {items.length ? (
          <nav className="ec-navbar__nav" aria-label="Main navigation">
            {items.map(({ label, active, className: itemClassName, ...item }) => (
              <a
                key={`${item.href ?? ''}-${String(label)}`}
                className={['ec-navbar__link', active && 'is-active', itemClassName]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={active ? 'page' : undefined}
                {...item}
              >
                {label}
              </a>
            ))}
          </nav>
        ) : null}
        {actions ? <div className="ec-navbar__actions">{actions}</div> : null}
        {menuButton ? (
          <button
            className={['ec-navbar__menu-button', menuButtonClassName].filter(Boolean).join(' ')}
            type={menuButtonType ?? 'button'}
            {...restMenuButtonProps}
          >
            {menuButton}
          </button>
        ) : null}
      </div>
    </header>
  );
});
