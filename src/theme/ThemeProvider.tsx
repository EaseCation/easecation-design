import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Slot } from 'radix-ui';
import type { Density, ThemeMode, ThemeOverrides } from '../tokens';

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  density: Density;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  resolvedMode: 'light',
  density: 'comfortable',
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
  mode = 'system',
  density = 'comfortable',
  tokens,
  colorTheme = 'default',
  className,
  style,
  asChild = false,
  ...props
}: ThemeProviderProps) {
  const systemMode = useSyncExternalStore(
    mode === 'system' ? subscribeToSystemMode : subscribeToNothing,
    mode === 'system' ? getSystemModeSnapshot : getServerSystemModeSnapshot,
    getServerSystemModeSnapshot,
  );
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const tokenStyle = useMemo(
    () => ({ ...style, ...tokens }) as React.CSSProperties,
    [style, tokens],
  );
  const value = useMemo(() => ({ mode, resolvedMode, density }), [mode, resolvedMode, density]);
  const rootProps = {
    ...props,
    className: ['ec-root', resolvedMode === 'dark' && 'dark', className].filter(Boolean).join(' '),
    style: tokenStyle,
    'data-ec-theme': resolvedMode,
    'data-ec-color-theme': colorTheme,
    'data-color-theme': colorTheme,
    'data-ec-density': density,
  };

  return (
    <ThemeContext.Provider value={value}>
      {asChild ? (
        <Slot.Root {...rootProps}>{children}</Slot.Root>
      ) : (
        <div {...rootProps}>{children}</div>
      )}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
