# DescriptionList

DescriptionList presents labelled values with native description-list semantics. Its one-, two-,
and three-column layouts collapse to one column on narrow screens.

## Import

```tsx
import { DescriptionList } from '@easecation/design';
```

## Example

```tsx
<DescriptionList
  columns={2}
  appearance="bordered"
  items={[
    { term: 'Owner', description: 'Avery' },
    { term: 'Region', description: 'East' },
    { term: 'Endpoint', description: 'service.example.test', span: 2 },
  ]}
/>
```

## API

`items`; `columns`: `1 | 2 | 3`; `layout`: `horizontal | vertical`; `appearance`:
`plain | bordered`; `size`: `sm | md`; remaining props inherit from `dl`.

Each item contains `term`, `description`, optional stable `key`, and optional `span`: `1 | 2 | 3`.

## Usage

- Use for read-only labelled values, not editable form fields.
- Use `bordered` only when values need stronger row and column separation.
- Long values wrap rather than changing the page width. All multi-column layouts become a single
  column below the tablet breakpoint.
- Do not override term colors, borders, radius, or responsive grid behavior with `className`.

- **Maturity**: beta
- **Platforms**: web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **Accessibility**: native-description-list, responsive-reading-order
- **Tokens**: `--ec-color-text`, `--ec-color-text-muted`, `--ec-color-border`, `--ec-color-panel`

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare const DescriptionList: ForwardRefExoticComponent<
  DescriptionListProps & RefAttributes<HTMLDListElement>
>;

export declare interface DescriptionListProps extends ComponentPropsWithoutRef<'dl'> {
  items: DescriptionListItem[];
  columns?: 1 | 2 | 3;
  layout?: 'horizontal' | 'vertical';
  appearance?: 'plain' | 'bordered';
  size?: 'sm' | 'md';
}

export declare interface DescriptionListItem {
  key?: Key;
  term: ReactNode;
  description: ReactNode;
  span?: 1 | 2 | 3;
}
```

<!-- generated-api:end -->
