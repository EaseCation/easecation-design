import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ChevronsUpDown, UserRound } from 'lucide-react';

export interface SidebarAccountButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  avatar?: ReactNode;
  /** Image URL; avatar (or the default icon) is shown while loading or on failure. */
  avatarSrc?: string;
  collapsed?: boolean;
}

function AccountImage({ src, fallback }: { src: string; fallback: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');
  return (
    <>
      {status !== 'loaded' ? fallback : null}
      {status !== 'failed' ? (
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          style={status === 'loaded' ? undefined : { display: 'none' }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('failed')}
        />
      ) : null}
    </>
  );
}

/** The shared account menu trigger; menu items remain owned by the application. */
export const SidebarAccountButton = forwardRef<HTMLButtonElement, SidebarAccountButtonProps>(
  function SidebarAccountButton(
    { name, avatar, avatarSrc, collapsed = false, className, type = 'button', ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={['ec-sidebar-account', 'ec-sidebar-row', 'ec-focusable', className]
          .filter(Boolean)
          .join(' ')}
        data-collapsed={collapsed || undefined}
        aria-label={name}
        title={collapsed ? name : undefined}
        {...props}
      >
        <span className="ec-sidebar-avatar" aria-hidden="true">
          {avatarSrc ? (
            <AccountImage key={avatarSrc} src={avatarSrc} fallback={avatar ?? <UserRound />} />
          ) : (
            (avatar ?? <UserRound />)
          )}
        </span>
        {!collapsed ? (
          <>
            <span className="ec-sidebar-label">{name}</span>
            <ChevronsUpDown className="ec-sidebar-chevron" aria-hidden="true" />
          </>
        ) : null}
      </button>
    );
  },
);
