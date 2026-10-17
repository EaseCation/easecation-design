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

提示底色和边框使用 sRGB 混色保持语义色相；图标使用对应的语义文字色，正文沿用面板前景色。支持浅色、深色与品牌主题。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const Alert: ForwardRefExoticComponent<AlertProps & RefAttributes<HTMLDivElement>>;

export declare interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  icon?: ReactNode | false;
  action?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export declare type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
```

<!-- generated-api:end -->
