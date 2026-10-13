# ActionCard

ActionCard is a native button surface for repeated, content-rich actions such as search results,
pickers, and editable summary tiles. It is not a replacement for passive Card content.

## Import

```tsx
import { ActionCard } from '@easecation/design';
import '@easecation/design/style.css';
```

## Example

```tsx
<ActionCard selected={selected} onClick={openItem}>
  <strong>Player Alpha</strong>
  <span>Open details</span>
</ActionCard>
```

## API

`size`: `sm | md`; `selected`; `children`; all remaining props inherit from native `button`.
When `selected` is provided, ActionCard exposes the state through `aria-pressed`.

## Usage

- Use ActionCard when the whole repeated surface performs one action.
- Do not nest buttons, links, inputs, or other interactive controls inside it.
- Keep a visible text label; supporting color and icons must not be the only accessible name.
- Use passive Card when the surface contains multiple independent actions.

- **Maturity**: beta
- **Platforms**: web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **Accessibility**: native-button, keyboard-activation, visible-focus, selected-state, touch-target
- **Tokens**: `--ec-color-panel`, `--ec-color-text`, `--ec-color-border`, `--ec-color-primary`, `--ec-touch-target`

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const ActionCard: ForwardRefExoticComponent<
  ActionCardProps & RefAttributes<HTMLButtonElement>
>;

export declare interface ActionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
  selected?: boolean;
}
```

<!-- generated-api:end -->
