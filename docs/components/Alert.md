# Alert

Alert presents contextual feedback with a semantic tone, optional action, and optional dismiss
control. It replaces consumer-authored color panels for domain-neutral notices.

## Import

```tsx
import { Alert } from '@easecation/design';
```

## Example

```tsx
<Alert tone="warning" title="Review required" action={<Button variant="outline">Review</Button>}>
  Two settings need attention before publishing.
</Alert>
```

## API

`tone`: `neutral | info | success | warning | danger`; `title`; `children`; `icon`; `action`;
`onDismiss`; `dismissLabel`; remaining props inherit from `div`.

## Usage

- Use `danger` for failures requiring immediate attention, `warning` for recoverable risk, and
  `info` or `success` for informational feedback.
- The default role is `alert` for danger and `status` for other tones. Pass `role="note"` for
  persistent, non-live guidance.
- Provide a localized `dismissLabel` when the alert can be dismissed.
- Do not override tone colors, borders, radius, spacing, or icon treatment with `className`.

- **Maturity**: beta
- **Platforms**: web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **Accessibility**: semantic-live-region, decorative-icon-hidden, labelled-dismiss-control
- **Tokens**: `--ec-color-info`, `--ec-color-success`, `--ec-color-warning`,
  `--ec-color-danger`
