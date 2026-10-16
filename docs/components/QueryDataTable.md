# QueryDataTable

数据展示组件。请求状态应通过 Props 显式传入。

## 导入

```tsx
import { QueryDataTable } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<QueryDataTable data={data} columns={columns} mobileCard={(row) => <MobileCard row={row} />} />
```

## API

data；columns；getRowId；isLoading；mobileCard；layout；empty/error 文案；onRetry；renderTableRow。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：native-table, mobile-card-fallback, loading-empty-error-states
- **主要 Token**：`--ec-color-surface-raised`, `--ec-color-border`

## 请求状态

优先传 `isError` 表示失败，可以不提供错误描述。未传 `isError` 时，仅非空 `errorDescription` 触发失败态，保持旧调用的行为；静态配置的 `errorTitle` 不会隐藏正常数据。显式 `isError={false}` 可覆盖保留的旧错误描述。

首次加载使用 `isLoading` 显示带 `role="status"` 和 `aria-busy` 的骨架，`loadingLabel` 可自定义播报。后台刷新使用 `isRefreshing`，已有行保留，并以 `aria-busy` 标记刷新过程。请求、缓存和响应顺序由应用管理。

默认加载、空数据、失败和重试文案来自 `LocaleProvider`；业务相关的描述由应用传入。

## 使用约束

- 业务状态、请求、权限和路由由应用层维护，通过 Props 和回调传入。
- 同一个值不要同时使用受控属性与 default* 属性。
- 不覆盖组件内部 DOM 选择器；品牌和密度通过 ThemeProvider、Token 或公开 className 调整。
- 在 320、390、768 和桌面宽度验证响应式；交互组件同时验证键盘、焦点和禁用状态。
- 完整类型以 @easecation/design 发布包的 TypeScript 声明为准，Storybook 是行为和视觉事实来源。

## 兼容性

从其他 UI 实现替换到该组件时，不要只修改组件名称。应同时核对 Props 模型、受控状态、Compound API、移动端布局、空/错/加载状态和可访问性语义。

## Mobile records inside a DataPanel

Use `SectionCard` in `mobileCard` for individually grouped records. `DataPanel` automatically becomes a transparent layout when its direct content is a mobile card list, so gaps reveal the page canvas just as in a standalone list. Toolbar and pagination remain outside record cards. Desktop tables retain the panel surface. Long card headings and descriptions wrap without consumer CSS overrides.

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function QueryDataTable<T>({
  data,
  columns,
  getRowId,
  isLoading,
  isError,
  isRefreshing,
  loadingLabel: loadingLabelProp,
  mobileCard,
  layout,
  renderTableRow,
  embedded,
  embeddedShellClassName,
  panelClassName,
  tableClassName,
  tableRowClassName,
  emptyTitle: emptyTitleProp,
  emptyDescription,
  errorTitle: errorTitleProp,
  errorDescription,
  retryLabel: retryLabelProp,
  onRetry,
}: QueryDataTableProps<T>): JSX.Element;

export declare interface QueryDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  getRowId?: (row: T, index: number) => string;
  isLoading?: boolean;
  isError?: boolean;
  /** Retain existing rows while a background request runs. */
  isRefreshing?: boolean;
  loadingLabel?: string;
  mobileCard?: (row: T) => ReactNode;
  layout?: 'auto' | 'table';
  renderTableRow?: (props: QueryDataTableRowRenderProps<T>) => ReactNode;
  embedded?: boolean;
  embeddedShellClassName?: string;
  panelClassName?: string;
  tableClassName?: string;
  tableRowClassName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export declare type QueryDataTableRowRenderProps<T> = {
  rowId: string;
  row: T;
  className?: string;
  children: ReactNode;
};
```

<!-- generated-api:end -->
