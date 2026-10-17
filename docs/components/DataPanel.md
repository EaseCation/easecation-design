# DataPanel

连续的数据工作区，用于在一个表面内组合筛选、工具栏、查询结果和分页。它不负责请求状态或业务逻辑。

## 导入

```tsx
import { DataPanel, FilterBar, QueryDataTable } from '@easecation/design';
import '@easecation/design/style.css';
```

## 基础示例

```tsx
<DataPanel
  toolbar={<FilterBar actions={<Button>查询</Button>}>{filters}</FilterBar>}
  footer={<Pagination page={page} total={total} onPageChange={setPage} />}
>
  <QueryDataTable data={data} columns={columns} embedded />
</DataPanel>
```

## API

`DataPanelProps` 继承 `section` 的原生属性，并提供 `header`、`toolbar`、`children` 和 `footer` 插槽。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：semantic-section, composable-workspace-regions
- **主要 Token**：`--ec-color-surface-raised`, `--ec-color-on-surface-raised`

## 使用约束

- 列表页的筛选、结果和分页应放在同一个 `DataPanel` 中，不为筛选栏单独创建卡片。
- 内部 `QueryDataTable` 使用 `embedded`，避免重复表面和边框。
- 页面标题属于 `PageScaffold`；内容分区标题属于 `SectionCard`，不要用 `DataPanel` 模拟页面标题卡片。
- 业务状态、请求、权限和路由由应用层维护，通过 Props 和回调传入。

## 手机端对齐

卡片列表不额外添加外侧 padding 或 margin，由页面容器统一控制左右留白；卡片内部留白仍由 `SectionCard` 管理。`DataPanel` 的手机卡片模式将筛选栏、卡片和分页对齐到同一左右边界。骨架、空数据和失败状态沿用同一布局，避免请求完成时边缘跳动。`layout="table"` 的表格布局不受影响。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function DataPanel({
  header,
  toolbar,
  footer,
  className,
  children,
  ...props
}: DataPanelProps): JSX.Element;

export declare interface DataPanelProps extends ComponentProps<'section'> {
  header?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
}
```

<!-- generated-api:end -->
