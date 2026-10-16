# ThemeModeMenuItems

A shared display-mode section for account and appearance menus. Compose inside `DropdownMenuContent` with a controlled `value` (`light`, `dark`, or `system`) and `onValueChange`. The host owns persistence and theme application.

Uses `DropdownMenuRadioGroup` and `DropdownMenuRadioItem` for consistent spacing, icons, selection indicators, and keyboard behavior. Override `labels` to localize the heading and mode names. The default labels are 显示模式、浅色模式、深色模式、跟随系统.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function ThemeModeMenuItems({
  value,
  onValueChange,
  labels,
}: ThemeModeMenuItemsProps): JSX.Element;

export declare interface ThemeModeMenuItemsProps {
  value: ThemeModeMenuValue;
  onValueChange: (value: ThemeModeMenuValue) => void;
  /** Localized section heading and mode labels. */
  labels?: Partial<Record<ThemeModeMenuValue | 'heading', string>>;
}

export declare type ThemeModeMenuValue = 'light' | 'dark' | 'system';
```

<!-- generated-api:end -->
