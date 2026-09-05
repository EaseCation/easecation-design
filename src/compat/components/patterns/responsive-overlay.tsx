import * as React from 'react';

import { EASECATION_MOBILE_MEDIA_QUERY as MOBILE_MEDIA_QUERY } from '../../lib/config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet';
import { useMediaQuery } from '../../hooks/use-media-query';
import { cn } from '../../lib/utils';

export type ResponsiveOverlayDesktopSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const DESKTOP_SIZE_CLASS: Record<ResponsiveOverlayDesktopSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-2xl',
  lg: 'sm:max-w-3xl',
  xl: 'sm:max-w-5xl',
  full: 'w-[min(calc(100vw-2rem),90rem)] max-w-none sm:max-w-none',
};

const ResponsiveOverlayContext = React.createContext({ isMobile: false });

function useResponsiveOverlay() {
  return React.useContext(ResponsiveOverlayContext);
}

export function ResponsiveOverlay({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const contextValue = React.useMemo(() => ({ isMobile }), [isMobile]);

  if (isMobile) {
    return (
      <ResponsiveOverlayContext.Provider value={contextValue}>
        <Sheet open={open} onOpenChange={onOpenChange}>
          {children}
        </Sheet>
      </ResponsiveOverlayContext.Provider>
    );
  }

  return (
    <ResponsiveOverlayContext.Provider value={contextValue}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </ResponsiveOverlayContext.Provider>
  );
}

export function ResponsiveOverlayTrigger({ ...props }: React.ComponentProps<typeof SheetTrigger>) {
  const { isMobile } = useResponsiveOverlay();

  if (isMobile) {
    return <SheetTrigger {...props} />;
  }

  return <DialogTrigger {...props} />;
}

export interface ResponsiveOverlayContentProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  mobileSide?: 'top' | 'right' | 'bottom' | 'left';
  desktopSize?: ResponsiveOverlayDesktopSize;
  showCloseButton?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  /** 跳过开关动画 */
  instant?: boolean;
  /** 关闭时仍挂载内容，便于预热 */
  forceMount?: true;
}

export function ResponsiveOverlayContent({
  children,
  className,
  mobileClassName,
  mobileSide = 'bottom',
  desktopSize = 'lg',
  showCloseButton = true,
  onOpenAutoFocus,
  instant = false,
  forceMount,
}: ResponsiveOverlayContentProps) {
  const { isMobile } = useResponsiveOverlay();

  if (isMobile) {
    return (
      <SheetContent
        side={mobileSide}
        showCloseButton={showCloseButton}
        instant={instant}
        forceMount={forceMount}
        className={cn(
          'flex max-h-[min(92dvh,720px)] w-full max-w-none flex-col gap-0 overflow-hidden p-0',
          mobileSide === 'bottom' && 'inset-x-0 rounded-t-xl',
          mobileClassName,
        )}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        {children}
      </SheetContent>
    );
  }

  return (
    <DialogContent
      showCloseButton={showCloseButton}
      instant={instant}
      forceMount={forceMount}
      className={cn(
        'flex max-h-[min(92dvh,58rem)] flex-col gap-0 overflow-hidden p-0',
        DESKTOP_SIZE_CLASS[desktopSize],
        className,
      )}
      onOpenAutoFocus={onOpenAutoFocus}
    >
      {children}
    </DialogContent>
  );
}

export function ResponsiveOverlayHeader({ className, ...props }: React.ComponentProps<'div'>) {
  const { isMobile } = useResponsiveOverlay();

  if (isMobile) {
    return (
      <SheetHeader
        className={cn('shrink-0 space-y-1 border-b bg-muted/20 px-4 py-4', className)}
        {...props}
      />
    );
  }

  return (
    <DialogHeader
      className={cn('shrink-0 space-y-1 border-b bg-muted/20 px-4 py-4 pr-12 text-left', className)}
      {...props}
    />
  );
}

export function ResponsiveOverlayTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetTitle>) {
  const { isMobile } = useResponsiveOverlay();

  if (isMobile) {
    return <SheetTitle className={className} {...props} />;
  }

  return <DialogTitle className={className} {...props} />;
}

export function ResponsiveOverlayDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetDescription>) {
  const { isMobile } = useResponsiveOverlay();

  if (isMobile) {
    return <SheetDescription className={className} {...props} />;
  }

  return <DialogDescription className={className} {...props} />;
}

export function ResponsiveOverlayFooter({ className, ...props }: React.ComponentProps<'div'>) {
  const { isMobile } = useResponsiveOverlay();

  if (isMobile) {
    return (
      <SheetFooter
        className={cn(
          'mt-0 w-full shrink-0 flex-row justify-end gap-2 border-t px-4 py-4',
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <DialogFooter
      className={cn(
        'mx-0 mb-0 w-full shrink-0 rounded-none border-t bg-transparent px-4 py-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

export function ResponsiveOverlayBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto px-4 py-4', className)} {...props} />;
}
