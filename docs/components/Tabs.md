# Tabs

导航或访问边界组件。路由和服务端权限仍由应用负责。

## 导入

```tsx
import { Tabs, TabsContent, TabsList, TabsRoot, TabsTrigger } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<Tabs items={[{ value: 'info', label: '资料', content: <Info /> }]} />

<TabsRoot defaultValue="info">
  <TabsList variant="line">
    <TabsTrigger value="info">资料</TabsTrigger>
    <TabsTrigger value="history">历史</TabsTrigger>
  </TabsList>
  <TabsContent value="info"><Info /></TabsContent>
  <TabsContent value="history"><History /></TabsContent>
</TabsRoot>
```

## API

简单页面使用 `Tabs` 的 items API；需要自由布局时使用 `TabsRoot`、`TabsList`、`TabsTrigger` 和 `TabsContent`。`TabsList.variant` 仅支持 `default | line`。横向空间不足时，`TabsList` 会把溢出项收进右侧菜单；可用 `overflowLabel` 覆盖菜单按钮的无障碍名称，不要再为 Tab 列表添加横向滚动。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：roving-tabindex, arrow-keys, tabpanel-semantics
- **主要 Token**：`--ec-color-primary`, `--ec-color-border`

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
export declare function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}: TabsProps): JSX.Element;

export declare interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}
```
