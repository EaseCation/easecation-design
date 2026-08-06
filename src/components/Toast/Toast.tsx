import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ExternalToast,
  type ToasterProps,
} from 'sonner';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';
export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}
interface ToastApi {
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);
let nextId = 1;

export function Toaster({
  theme = 'system',
  position = 'top-right',
  mobileOffset = {
    top: 'calc(0.875rem + var(--ec-safe-top, 0px))',
    right: '0.875rem',
    bottom: '0.875rem',
    left: '0.875rem',
  },
  swipeDirections,
  ...props
}: ToasterProps) {
  return (
    <SonnerToaster
      theme={theme}
      position={position}
      mobileOffset={mobileOffset}
      swipeDirections={swipeDirections ?? (position.startsWith('top') ? ['top', 'left', 'right'] : undefined)}
      className="toaster ec-toaster"
      icons={{
        success: <CircleCheckIcon className="ec-toast-icon" />,
        info: <InfoIcon className="ec-toast-icon" />,
        warning: <TriangleAlertIcon className="ec-toast-icon" />,
        error: <OctagonXIcon className="ec-toast-icon" />,
        loading: <Loader2Icon className="ec-toast-icon ec-toast-icon--loading" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          '--shadow': 'var(--shadow-lg)',
          fontFamily: 'var(--ec-font-sans)',
        } as CSSProperties
      }
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          ...props.toastOptions?.classNames,
          toast: ['cn-toast', props.toastOptions?.classNames?.toast].filter(Boolean).join(' '),
        },
      }}
      {...props}
    />
  );
}

const toneMethod = {
  info: sonnerToast.info,
  success: sonnerToast.success,
  warning: sonnerToast.warning,
  danger: sonnerToast.error,
} satisfies Record<ToastTone, (message: ReactNode, data?: ExternalToast) => string | number>;

export function ToastProvider({
  children,
  position = 'top-right',
}: {
  children: ReactNode;
  position?: 'top-right' | 'top-center' | 'bottom-center';
}) {
  const ownedIds = useRef(new Set<number>());
  const dismiss = useCallback((id: number) => {
    ownedIds.current.delete(id);
    sonnerToast.dismiss(id);
  }, []);
  const show = useCallback((options: ToastOptions) => {
    const id = nextId++;
    const tone = options.tone ?? 'info';
    ownedIds.current.add(id);
    toneMethod[tone](options.title, {
      id,
      description: options.description,
      duration: options.duration ?? 4000,
      onDismiss: () => ownedIds.current.delete(id),
      onAutoClose: () => ownedIds.current.delete(id),
    });
    return id;
  }, []);
  useEffect(
    () => () => {
      for (const id of ownedIds.current) sonnerToast.dismiss(id);
      ownedIds.current.clear();
    },
    [],
  );
  const api = useMemo(() => ({ show, dismiss }), [dismiss, show]);
  return (
    <ToastContext.Provider value={api}>
      <Toaster richColors position={position} />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}

export interface ToastController {
  success: (message: ReactNode, data?: ExternalToast) => string | number;
  info: (message: ReactNode, data?: ExternalToast) => string | number;
  warning: (message: ReactNode, data?: ExternalToast) => string | number;
  error: (message: ReactNode, data?: ExternalToast) => string | number;
  loading: (message: ReactNode, data?: ExternalToast) => string | number;
  dismiss: (id?: string | number) => string | number;
}

export const toast: ToastController = {
  success: (message, data) => sonnerToast.success(message, data),
  info: (message, data) => sonnerToast.info(message, data),
  warning: (message, data) => sonnerToast.warning(message, data),
  error: (message, data) => sonnerToast.error(message, data),
  loading: (message, data) => sonnerToast.loading(message, data),
  dismiss: (id) => sonnerToast.dismiss(id),
};
