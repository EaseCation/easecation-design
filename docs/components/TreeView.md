# TreeView

TreeView presents hierarchical navigation or structured data with one roving keyboard focus target.

## Import

```tsx
import { TreeView } from '@easecation/design';
```

## Basic usage

```tsx
<TreeView
  ariaLabel="Project files"
  items={items}
  selectedValue={selected}
  onSelectedValueChange={setSelected}
  expandedValues={expanded}
  onExpandedValuesChange={setExpanded}
/>
```

## API

`items`; `selectedValue/defaultSelectedValue`; `onSelectedValueChange`;
`expandedValues/defaultExpandedValues`; `onExpandedValuesChange`; `ariaLabel`; `emptyText`;
`className`.

Each item has a unique `value`, a `label`, and optional `description`, `icon`, `children`, and
`disabled` state. Clicking a branch selects and toggles it. Arrow Right expands a branch or enters
its first child; Arrow Left collapses a branch or returns to its parent. Arrow Up/Down and Home/End
move the single roving focus target through visible enabled items.

- **Maturity**: `beta`
- **Platforms**: web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **Accessibility**: tree semantics, roving tabindex, arrow navigation, visible focus, disabled items
- **Primary tokens**: `--ec-color-primary`, `--ec-color-focus`, `--ec-touch-target`

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function TreeView({
  items,
  selectedValue,
  defaultSelectedValue,
  onSelectedValueChange,
  expandedValues,
  defaultExpandedValues,
  onExpandedValuesChange,
  ariaLabel,
  emptyText,
  className,
}: TreeViewProps): JSX.Element;

export declare interface TreeViewProps {
  items: readonly TreeViewItem[];
  selectedValue?: string;
  defaultSelectedValue?: string;
  onSelectedValueChange?: (value: string) => void;
  expandedValues?: string[];
  defaultExpandedValues?: string[];
  onExpandedValuesChange?: (values: string[]) => void;
  ariaLabel: string;
  emptyText?: ReactNode;
  className?: string;
}

export declare interface TreeViewItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children?: readonly TreeViewItem[];
  disabled?: boolean;
}
```

<!-- generated-api:end -->
