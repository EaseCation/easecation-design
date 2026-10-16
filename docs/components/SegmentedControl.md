# SegmentedControl

SegmentedControl switches between a small set of mutually exclusive modes. It uses radio-group
semantics and roving keyboard focus.

## Import

```tsx
import { SegmentedControl } from '@easecation/design';
```

## Example

```tsx
<SegmentedControl
  ariaLabel="View"
  options={[
    { value: 'list', label: 'List' },
    { value: 'board', label: 'Board' },
  ]}
  value={view}
  onValueChange={setView}
/>
```

## API

`options`; `value/defaultValue`; `onValueChange`; `size`: `sm | md | lg`; `orientation`:
`horizontal | vertical`; `fullWidth`; required `ariaLabel`; optional `overflowLabel`; remaining props
inherit from `div`.

## Usage

- Use for two to five short, mutually exclusive options. Use Tabs when selection also owns a
  tabpanel, or Select when the set is longer.
- Horizontal controls support Left/Right and vertical controls support Up/Down. Home and End move
  to the first and last enabled options.
- Horizontal overflow is handled by the built-in trailing menu. The selected option is kept visible
  when space permits; applications must not add horizontal scrolling to the control.
- Overflow icons remain square (20px, or 24px for `lg`). On touch pointers, option heights and overflow button widths are at least the 44px touch-target token.
- Keep visible labels concise. Icons are supporting decoration and do not replace labels.
- Do not override the selected surface, focus ring, radius, or control height with `className`.

- **Maturity**: beta
- **Platforms**: web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **Accessibility**: radiogroup-semantics, roving-tabindex, arrow-keys, touch-target
- **Tokens**: `--ec-color-muted`, `--ec-color-panel`, `--ec-color-focus`, `--ec-touch-target`

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  size,
  orientation,
  fullWidth,
  ariaLabel,
  overflowLabel,
  className,
  ...props
}: SegmentedControlProps): JSX.Element;

export declare interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  ariaLabel: string;
  overflowLabel?: string;
}

export declare interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}
```

<!-- generated-api:end -->
