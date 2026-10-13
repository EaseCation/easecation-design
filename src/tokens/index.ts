export const breakpoints = { phone: 480, tablet: 768, desktop: 1024, wide: 1440 } as const;
export type Breakpoint = keyof typeof breakpoints;

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
