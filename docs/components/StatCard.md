# StatCard

数据展示组件。请求状态应通过 Props 显式传入。

## 导入

```tsx
import { StatCard } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<StatCard label="在线用户" value="12,846" delta="8.7%" trend="up" size="sm" />
```

## API

label；value；可选 delta；hint；trend: up | down | steady；icon；action；size: sm | md；tone: default | success | warning | danger。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：non-color-trend-label, semantic-article
- **主要 Token**：`--card`, `--success`, `--danger`

## 使用约束

- 业务状态、请求、权限和路由由应用层维护，通过 Props 和回调传入。
- 同一个值不要同时使用受控属性与 default* 属性。
- 不覆盖组件内部 DOM 选择器；品牌和密度通过 ThemeProvider、Token 或公开 className 调整。
- 在 320、390、768 和桌面宽度验证响应式；交互组件同时验证键盘、焦点和禁用状态。
- 完整类型以 @easecation/design 发布包的 TypeScript 声明为准，Storybook 是行为和视觉事实来源。

## 兼容性

从其他 UI 实现替换到该组件时，不要只修改组件名称。应同时核对 Props 模型、受控状态、Compound API、移动端布局、空/错/加载状态和可访问性语义。

## TypeScript 公开声明

以下内容直接来自发布包的 `index.d.ts`，用于核对完整 Props、联合类型、泛型和原生属性继承。

```ts
export declare function StatCard({
  label,
  value,
  delta,
  hint,
  trend,
  icon,
  action,
  size,
  tone,
  className,
  ...props
}: StatCardProps): JSX.Element;

export declare interface StatCardProps extends ComponentProps<'article'> {
  label: string;
  value: ReactNode;
  delta?: string;
  hint?: string;
  trend?: 'up' | 'down' | 'steady';
  icon?: ReactNode;
  action?: ReactNode;
  size?: 'sm' | 'md';
  tone?: 'default' | 'success' | 'warning' | 'danger';
}
```
