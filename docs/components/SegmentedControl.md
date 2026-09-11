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
- Keep visible labels concise. Icons are supporting decoration and do not replace labels.
- Do not override the selected surface, focus ring, radius, or control height with `className`.

- **Maturity**: beta
- **Platforms**: web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **Accessibility**: radiogroup-semantics, roving-tabindex, arrow-keys, touch-target
- **Tokens**: `--ec-color-muted`, `--ec-color-panel`, `--ec-color-focus`, `--ec-touch-target`
