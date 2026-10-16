import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../DropdownMenu/DropdownMenu';

export type ThemeModeMenuValue = 'light' | 'dark' | 'system';

export interface ThemeModeMenuItemsProps {
  value: ThemeModeMenuValue;
  onValueChange: (value: ThemeModeMenuValue) => void;
  /** Localized section heading and mode labels. */
  labels?: Partial<Record<ThemeModeMenuValue | 'heading', string>>;
}

const defaultLabels = {
  heading: '显示模式',
  light: '浅色模式',
  dark: '深色模式',
  system: '跟随系统',
};
const modes = [
  { value: 'light', icon: SunIcon },
  { value: 'dark', icon: MoonIcon },
  { value: 'system', icon: MonitorIcon },
] as const;

/** Place inside DropdownMenuContent to share theme selection across applications. */
export function ThemeModeMenuItems({ value, onValueChange, labels }: ThemeModeMenuItemsProps) {
  const text = { ...defaultLabels, ...labels };
  return (
    <>
      <DropdownMenuLabel>{text.heading}</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        aria-label={text.heading}
        value={value}
        onValueChange={(next) => {
          if (next === 'light' || next === 'dark' || next === 'system') onValueChange(next);
        }}
      >
        {modes.map(({ value: mode, icon: Icon }) => (
          <DropdownMenuRadioItem key={mode} value={mode}>
            <Icon />
            {text[mode]}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  );
}
