export const breakpoints = { phone: 480, tablet: 768, desktop: 1024, wide: 1440 } as const;
export type Breakpoint = keyof typeof breakpoints;

export const defaultTokens = {
  color: {
    primary: 'oklch(0.54 0.24 262)',
    background: 'oklch(0.985 0.005 255)',
    surface: 'oklch(1 0 0)',
    text: 'oklch(0.18 0.025 264)',
    success: 'oklch(0.70 0.19 152)',
    warning: 'oklch(0.77 0.17 78)',
    danger: 'oklch(0.60 0.24 25)',
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
  },
  typography: {
    size: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' },
  },
  radius: {
    sm: '0.325rem',
    md: '0.425rem',
    lg: '0.5rem',
    xl: '0.675rem',
    '2xl': '0.875rem',
    pill: '999px',
  },
  size: { sm: '2rem', md: '2.5rem', lg: '3rem' },
  motion: { fast: '180ms', base: '280ms', slow: '420ms' },
  zIndex: {
    base: 0,
    sticky: 100,
    overlay: 500,
    modal: 600,
    dropdown: 700,
    tooltip: 750,
    toast: 800,
  },
  touchTarget: '2.75rem',
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'comfortable';
export type ThemeOverrides = Partial<Record<`--ec-${string}`, string | number>>;
export * from './easecation';

export type ColorThemeMode = 'light' | 'dark' | 'system';

export interface ColorThemePreset {
  id: string;
  name: string;
  description: string;
  modes: Array<'light' | 'dark'>;
  previewColor: string;
}

export const COLOR_THEME_PRESETS: ColorThemePreset[] = [
  {
    id: 'default',
    name: '默认',
    description: '经典蓝色主题',
    modes: ['light', 'dark'],
    previewColor: 'oklch(0.54 0.24 262)',
  },
  {
    id: 'black-gold',
    name: '黑金(不支持浅色模式)',
    description: '暗色奢华金色',
    modes: ['dark'],
    previewColor: 'oklch(0.80 0.16 85)',
  },
];

export function getColorThemePreset(id: string): ColorThemePreset {
  return COLOR_THEME_PRESETS.find((preset) => preset.id === id) ?? COLOR_THEME_PRESETS[0];
}
