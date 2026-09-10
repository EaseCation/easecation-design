# FileButton

以设计系统按钮触发原生文件选择器，避免各业务重复实现隐藏 input、ref 和禁用态同步。

## 导入

```tsx
import { FileButton } from '@easecation/design';
```

## 示例

```tsx
<FileButton accept="application/json" onChange={handleFileChange}>
  导入 JSON
</FileButton>
```

## API

继承 `Button` 的视觉和交互属性，并提供 `accept`、`multiple`、`capture`、`name`、`form` 和文件 input 的 `onChange`。转发的 ref 指向原生文件 input。

- 浏览器和 WebView 均使用原生文件选择流程。
- 禁用态同时作用于按钮和 input。
- 选择后如需允许再次选择同一文件，应在 `onChange` 中清空 `event.currentTarget.value`。
