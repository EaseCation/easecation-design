# FilterBar

页面布局组件，用于替代重复的 Grid、侧栏和 Sticky Footer CSS。

## 导入

```tsx
import { FilterBar } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<FilterBar onSearch={search} align="start">
  <FilterField label="时间范围" width="range">
    <Input />
  </FilterField>
</FilterBar>
```

## API

actions；variant: card | plain；align: start | end；onSearch；children。

`actions` 中的按钮会等分动作区宽度；窄屏下动作区占满可用宽度，避免主次按钮因图标或字数不同而出现尺寸跳变。

混合单行和可增高控件时使用 `align="start"`，保持字段标签顶部对齐。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：enter-search, responsive-reflow
- **主要 Token**：`--card`, `--border`

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
export declare function FilterBar({
  className,
  actions,
  children,
  variant,
  align,
  onSearch,
  ...props
}: FilterBarProps): JSX.Element;

export declare interface FilterBarProps extends ComponentProps<'div'> {
  actions?: ReactNode;
  variant?: 'card' | 'plain';
  align?: 'start' | 'end';
  onSearch?: () => void;
}
```
