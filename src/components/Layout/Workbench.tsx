import { MenuIcon } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Drawer } from '../Drawer';
import { IconButton } from '../Button';
export interface AppShellProps {
  brand: ReactNode;
  headerTitle?: ReactNode;
  headerActions?: ReactNode;
  sidebar: ReactNode;
  mobileSidebar?: ReactNode;
  bottomBar?: ReactNode;
  children: ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  sidebarWidth?: number;
  collapsedSidebarWidth?: number;
  mobileNavigationLabel?: string;
}
export function AppShell({
  brand,
  headerTitle,
  headerActions,
  sidebar,
  mobileSidebar,
  bottomBar,
  children,
  collapsed = false,
  sidebarWidth = 252,
  collapsedSidebarWidth = 68,
  mobileNavigationLabel = 'Open navigation',
}: AppShellProps) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const change = (next: boolean) => {
    setOpen(next);
    setPhase(next ? 'in' : 'out');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase(null), 760);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="ec-app-shell">
      <aside
        className="ec-app-shell__sidebar"
        data-collapsed={collapsed || undefined}
        style={{ width: collapsed ? collapsedSidebarWidth : sidebarWidth }}
      >
        {sidebar}
      </aside>
      <div className={['ec-app-shell__frame', open && 'is-drawer-open'].filter(Boolean).join(' ')}>
        <header
          className={['ec-app-shell__header', !headerTitle && !headerActions && 'is-mobile-only']
            .filter(Boolean)
            .join(' ')}
          data-native-safe-top
        >
          <div className="ec-app-shell__mobile-head">
            <IconButton
              className="ec-app-shell__menu-button"
              label={mobileNavigationLabel}
              icon={<MenuIcon />}
              variant="ghost"
              aria-expanded={open}
              onClick={() => change(true)}
            />
            <div>{brand}</div>
          </div>
          {headerTitle || headerActions ? (
            <div className="ec-app-shell__header-row">
              <div>{headerTitle}</div>
              {headerActions ? <div className="ec-app-shell__actions">{headerActions}</div> : null}
            </div>
          ) : null}
        </header>
        <main className="ec-app-shell__main">{children}</main>
        {bottomBar ? (
          <div className="ec-app-shell__bottom" data-native-safe-bottom>
            {bottomBar}
          </div>
        ) : null}
      </div>
      <Drawer
        open={open}
        onOpenChange={change}
        placement="left"
        title={undefined}
        className="ec-app-shell__drawer"
        showCloseButton={false}
      >
        <div
          className={phase ? `sidebar-tail-phase-${phase}` : undefined}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a[href]')) change(false);
          }}
        >
          {mobileSidebar ?? sidebar}
        </div>
      </Drawer>
    </div>
  );
}
export interface PageScaffoldProps extends Omit<ComponentProps<'section'>, 'title'> {
  title: ReactNode;
  titleIcon?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}
export function PageScaffold({
  title,
  titleIcon,
  eyebrow,
  actions,
  className,
  children,
  ...props
}: PageScaffoldProps) {
  return (
    <section className={['ec-page-scaffold', className].filter(Boolean).join(' ')} {...props}>
      <header>
        {
          <div>
            {eyebrow ? <p>{eyebrow}</p> : null}
            <h1>
              {titleIcon}
              {title}
            </h1>
          </div>
        }
        {actions ? <div className="ec-page-scaffold__actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}
export function ActionBar({ className, ...props }: ComponentProps<'div'>) {
  return <div className={['ec-action-bar', className].filter(Boolean).join(' ')} {...props} />;
}
export interface DetailWorkbenchProps extends ComponentProps<'div'> {
  sidebar?: ReactNode;
}
export function DetailWorkbench({ sidebar, className, children, ...props }: DetailWorkbenchProps) {
  return (
    <div className={['ec-workbench', className].filter(Boolean).join(' ')} {...props}>
      <div>{children}</div>
      {sidebar ? <aside>{sidebar}</aside> : null}
    </div>
  );
}
export interface FormWorkbenchProps extends ComponentProps<'div'> {
  aside?: ReactNode;
  footer?: ReactNode;
}
export function FormWorkbench({
  aside,
  footer,
  className,
  children,
  ...props
}: FormWorkbenchProps) {
  return (
    <div className={['ec-form-workbench', className].filter(Boolean).join(' ')} {...props}>
      <div className="ec-form-workbench__main">
        {children}
        {footer ? <div className="ec-form-workbench__footer">{footer}</div> : null}
      </div>
      {aside ? <aside className="ec-form-workbench__aside">{aside}</aside> : null}
    </div>
  );
}
