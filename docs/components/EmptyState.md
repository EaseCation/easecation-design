# EmptyState

反馈或浮层组件。必须验证焦点、Escape、遮罩关闭和移动端行为。

## 导入

```tsx
import { EmptyState } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<EmptyState title="暂无数据" action={<Button>新建</Button>} />

<EmptyState title="暂无结果" embedded />
```

## API

`title`；`description`；`icon`；`action`；`embedded`。嵌入已有卡片、表格或浮层时使用
`embedded`，避免重复的边框和背景。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：semantic-heading, custom-action
- **主要 Token**：`--ec-color-surface-raised`, `--ec-color-muted`

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
export declare function EmptyState({
  title,
  description,
  icon,
  action,
  embedded,
  className,
  ...props
}: EmptyStateProps): JSX.Element;

export declare interface EmptyStateProps extends ComponentProps<'div'> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  embedded?: boolean;
}
```

<!-- generated-api:end -->
