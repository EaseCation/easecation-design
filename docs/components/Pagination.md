# Pagination

共享页码导航、每页条数和跳页行为。数据请求、游标历史与分页状态由应用负责。

## 导入

```tsx
import { Pagination } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<Pagination
  page={page}
  total={total}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={(size) => {
    setPageSize(size);
    setPage(1);
  }}
  showPageJump
/>
```

## API

`page` 与 `onPageChange` 为受控页码。`total` 是条数，`pageSize` 默认 10；API 返回权威页数时可传 `totalPages`。未知总数省略 `total`，用 `hasNextPage` 控制后翻，不编造条数或末页。

`onPageSizeChange` 显示共享条数选择器；允许范围用 `pageSizeOptions` 指定。应用接收回调后重置页码/游标并查询。`showPageJump` 仅在已知页数时展示跳页，拒绝小数和越界输入，Enter 避开输入法合成。

`disabled` 在查询中统一锁定所有控件。`compact` 用于窄弹窗，只展示前后翻页和页码。手机自动折叠远端页码；保持已选页与前后按钮。共享标签继承 LocaleProvider，可用原有 label Props 覆盖。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：navigation-label, aria-current, button-labels
- **主要 Token**：`--ec-color-primary`, `--ec-color-secondary`

## 使用约束

- 业务状态、请求、权限和路由由应用层维护，通过 Props 和回调传入。
- 同一个值不要同时使用受控属性与 default* 属性。
- 不覆盖组件内部 DOM 选择器；品牌和密度通过 ThemeProvider、Token 或公开 className 调整。
- 在 320、390、768 和桌面宽度验证响应式；交互组件同时验证键盘、焦点和禁用状态。
- 完整类型以 @easecation/design 发布包的 TypeScript 声明为准，Storybook 是行为和视觉事实来源。

## 兼容性

从其他 UI 实现替换到该组件时，不要只修改组件名称。应同时核对 Props 模型、受控状态、Compound API、移动端布局、空/错/加载状态和可访问性语义。

## TypeScript 公开声明

以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。

<!-- generated-api:start -->

```ts
export declare function Pagination({
  page,
  total,
  hasNextPage,
  totalPages,
  compact,
  onPageSizeChange,
  pageSizeOptions,
  showPageJump,
  pageSize,
  onPageChange,
  siblingCount,
  disabled,
  className,
  showTotal,
  ariaLabel,
  previousLabel,
  nextLabel,
  totalLabel,
  pageLabel,
}: PaginationProps): JSX.Element;

export declare interface PaginationProps {
  page: number;
  /** Omit for cursor/unknown-total navigation; supply hasNextPage instead. */
  total?: number;
  hasNextPage?: boolean;
  /** Authoritative page count when supplied by the API. */
  totalPages?: number;
  compact?: boolean;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  showPageJump?: boolean;
  pageSize?: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
  className?: string;
  showTotal?: boolean;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  totalLabel?: (total: number) => string;
  pageLabel?: (page: number) => string;
}
```

<!-- generated-api:end -->
