# MultiSelect

可搜索的多选标签输入；`creatable` 模式允许录入选项目录外的值。

## 导入

```tsx
import { MultiSelect } from '@easecation/design';
```

## API

`options`；`value/defaultValue`；`onValueChange`；`creatable`；`createLabel`；`tokenSeparators`；`placeholder`；`searchPlaceholder`；`emptyText`；`label`；`removeLabel`；`size`；`status`；`disabled`；`required`；`name`。

- 值按选择顺序输出，不会因为搜索或重新渲染而排序。
- Backspace 删除最后一个标签，逗号等 `tokenSeparators` 可批量提交自定义值。
- 禁用选项不可通过鼠标或键盘加入。
- 下拉列表支持方向键与 Home/End 导航，并自动滚动到键盘高亮项。
