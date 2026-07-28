import { createContext, useContext, useEffect, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react';
import type { Density, ThemeMode, ThemeOverrides } from '../tokens';

interface ThemeContextValue { mode: ThemeMode; resolvedMode: 'light' | 'dark'; density: Density; }
const ThemeContext = createContext<ThemeContextValue>({ mode: 'system', resolvedMode: 'light', density: 'comfortable' });

export interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  children: ReactNode;
  mode?: ThemeMode;
  density?: Density;
  tokens?: ThemeOverrides;
  colorTheme?: 'default' | 'black-gold';
  asChild?: boolean;
}

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children, mode = 'system', density = 'comfortable', tokens, colorTheme = 'default', className, style, asChild = false, ...props }: ThemeProviderProps) {
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(getSystemMode);
  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemMode(query.matches ? 'dark' : 'light');
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [mode]);
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const tokenStyle = useMemo(() => ({ ...style, ...tokens }) as React.CSSProperties, [style, tokens]);
  const value = useMemo(() => ({ mode, resolvedMode, density }), [mode, resolvedMode, density]);
  if (asChild) return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  return <ThemeContext.Provider value={value}><div {...props} className={['ec-root', resolvedMode === 'dark' && 'dark', className].filter(Boolean).join(' ')} style={tokenStyle} data-ec-theme={resolvedMode} data-ec-color-theme={colorTheme} data-color-theme={colorTheme} data-ec-density={density}>{children}</div></ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);