import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Slot } from 'radix-ui';
import type { Density, ThemeMode, ThemeOverrides } from '../tokens';

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  density: Density;
  colorTheme: 'default' | 'black-gold';
  tokens: ThemeOverrides;
  portalContainer: HTMLDivElement | null;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  resolvedMode: 'light',
  density: 'comfortable',
  colorTheme: 'default',
  tokens: {},
  portalContainer: null,
});

export interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  children: ReactNode;
  mode?: ThemeMode;
  density?: Density;
  tokens?: ThemeOverrides;
  colorTheme?: 'default' | 'black-gold';
  asChild?: boolean;
}

function getSystemModeSnapshot(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerSystemModeSnapshot(): 'light' {
  return 'light';
}

function subscribeToSystemMode(onStoreChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => undefined;

  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
}

function subscribeToNothing() {
  return () => undefined;
}

export function ThemeProvider({
  children,
  mode: requestedMode,
  density: requestedDensity,
  tokens,
  colorTheme: requestedColorTheme,
  className,
  style,
  asChild = false,
  ...props
}: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const mode = requestedMode ?? parent.mode;
  const density = requestedDensity ?? parent.density;
  const colorTheme = requestedColorTheme ?? parent.colorTheme;
  const rootRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const attachPortal = useCallback((element: HTMLDivElement | null) => {
    portalRef.current = element;
    setPortalContainer(element);
  }, []);
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const systemMode = useSyncExternalStore(
    mode === 'system' ? subscribeToSystemMode : subscribeToNothing,
    mode === 'system' ? getSystemModeSnapshot : getServerSystemModeSnapshot,
    getServerSystemModeSnapshot,
  );
  const resolvedMode = colorTheme === 'black-gold' ? 'dark' : mode === 'system' ? systemMode : mode;
  const inheritedTokens = useMemo(() => ({ ...parent.tokens, ...tokens }), [parent.tokens, tokens]);
  const tokenStyle = useMemo(
    () => ({ ...style, ...inheritedTokens }) as CSSProperties,
    [style, inheritedTokens],
  );
  const value = useMemo(
    () => ({ mode, resolvedMode, density, colorTheme, tokens: inheritedTokens, portalContainer }),
    [mode, resolvedMode, density, colorTheme, inheritedTokens, portalContainer],
  );
  useLayoutEffect(() => {
    const portal = portalRef.current;
    if (!rootRef.current || !portal) return;
    const computed = getComputedStyle(rootRef.current);
    portal.style.cssText = '';
    for (const property of computed) {
      if (property.startsWith('--'))
        portal.style.setProperty(property, computed.getPropertyValue(property));
    }
  }, [resolvedMode, density, colorTheme, tokenStyle, className, portalContainer]);
  const rootProps = {
    ...props,
    className: ['ec-root', resolvedMode === 'dark' && 'dark', className].filter(Boolean).join(' '),
    style: tokenStyle,
    'data-ec-theme': resolvedMode,
    'data-ec-color-theme': colorTheme,
    'data-color-theme': colorTheme,
    'data-ec-density': density,
    ref: rootRef,
  };

  return (
    <ThemeContext.Provider value={value}>
      {asChild ? (
        <Slot.Root {...rootProps}>{children}</Slot.Root>
      ) : (
        <div {...rootProps}>{children}</div>
      )}
      {mounted
        ? createPortal(
            <div
              ref={attachPortal}
              className="ec-root ec-theme-portal"
              data-ec-theme={resolvedMode}
              data-ec-color-theme={colorTheme}
              data-color-theme={colorTheme}
              data-ec-density={density}
            />,
            document.body,
          )
        : null}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
