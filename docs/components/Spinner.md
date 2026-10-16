# Spinner

A shared indeterminate loading indicator. Use `Button loading` for actions; use `Spinner` for an inline operation that cannot be represented by a content skeleton. Omit `size` to inherit text size, or choose `sm`, `md`, or `lg`.

Pass a localized `label` for standalone status. Without a label it is decorative (`aria-hidden`), so place visible status text beside it. Respects the shared reduced-motion rules.

```tsx
<Spinner label="Loading" />
<Button loading>Save</Button>
```

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const Spinner: ForwardRefExoticComponent<
  SpinnerProps & RefAttributes<HTMLSpanElement>
>;

export declare interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Omit to inherit the surrounding text size, including inside a button. */
  size?: 'sm' | 'md' | 'lg';
  /** Supply for standalone status; omit for decorative icons beside visible text. */
  label?: string;
}
```

<!-- generated-api:end -->
