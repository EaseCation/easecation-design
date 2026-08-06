# Combobox

可搜索的单选输入，适合选项较多、用户需要按名称或关键字定位的场景。

## 导入

```tsx
import { Combobox } from '@easecation/design';
```

## API

`options`；`value/defaultValue`；`onValueChange`；`placeholder`；`searchPlaceholder`；`emptyText`；`clearable`；`label`；`size`；`status`；`disabled`；`required`；`name`。

- `textValue` 提供 ReactNode 标签对应的搜索文本。
- `keywords` 提供不展示但可搜索的同义词。
- 组件提供 combobox/listbox 语义、方向键与 Home/End 导航、Enter 选择、Escape 关闭，并自动滚动到键盘高亮项。
