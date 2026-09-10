# StatusBadge

StatusBadge presents a short, text-labelled status with a consistent semantic tone. Use it instead
of combining Badge with product-specific color utilities.

## Import

```tsx
import { StatusBadge } from '@easecation/design';
import '@easecation/design/style.css';
```

## Example

```tsx
<StatusBadge tone="success" showDot>
  Available
</StatusBadge>
```

## API

`tone`: `neutral | info | success | warning | danger`; `appearance`: `soft | solid | outline`;
`icon`; `showDot`; `children`; remaining props inherit from `span`.

## Usage

- Always include a text label. Color and icons are supporting signals, not the only status cue.
- Use `soft` in dense tables and lists, `outline` for low-emphasis metadata, and `solid` only when
  stronger emphasis is necessary.
- Do not override status colors, borders, radius, or padding with `className`. Request a new tone or
  appearance when the public API cannot express a recurring need.

- **Maturity**: beta
- **Platforms**: web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **Accessibility**: text-status, non-color-label, decorative-icon-hidden
- **Tokens**: `--ec-color-success`, `--ec-color-warning`, `--ec-color-danger`, `--ec-color-info`
