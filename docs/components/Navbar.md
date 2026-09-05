# Navbar

产品导航组件，用于组合品牌标识、主导航、操作区和可选的菜单按钮。

## 导入

```tsx
import { Navbar } from '@easecation/design';
import '@easecation/design/style.css';
```

## 基础示例

```tsx
<Navbar
  brand={<a href="/">Product</a>}
  items={[
    { label: 'Overview', href: '/overview', active: true },
    { label: 'Activity', href: '/activity' },
  ]}
  actions={<Button>New item</Button>}
/>
```

## API

- `brand`：品牌或产品入口。
- `brand`、`brandHref`：品牌内容及其链接。
- `items`：包含 `label`、`active` 和原生链接属性的导航项。
- `actions`：导航右侧的操作区。
- `fixed`、`maxWidth`：固定定位与内容最大宽度。
- `menuButton`、`menuButtonProps`：可选菜单按钮的内容及原生按钮属性。

## 约束

- 导航项使用真实链接表达页面跳转，当前项由 `aria-current="page"` 标记。
- `brand` 和 `actions` 由消费方提供，组件不绑定 Logo、路由框架或业务权限模型。
- 菜单按钮的展开状态和菜单内容由应用层管理；通过 `menuButtonProps` 提供可访问名称和状态。

## 元数据

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：landmark-navigation, aria-current, keyboard-links
- **主要 Token**：`--background`, `--foreground`, `--border`, `--primary`
- **Storybook**：`components-navbar--product-navigation`
