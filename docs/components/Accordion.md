# Accordion

支持单项或多项展开的内容分组，并为每个标题提供独立的 `action` 区域。

## 导入

```tsx
import { Accordion } from '@easecation/design';
```

## API

`items`；`type`；`value/defaultValue`；`onValueChange`；`collapsible`；`ariaLabel`；`className`。

每个 item 包含 `value`、`title`、可选 `description`、可选 `action`、`content` 和 `disabled`。`action` 与展开按钮是兄弟节点，点击操作不会切换展开状态。
