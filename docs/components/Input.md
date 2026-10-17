# Input

数据录入组件。业务层负责值、校验、提交和服务端错误。

## 导入

```tsx
import { Input } from '@easecation/design';
import '@easecation/design/style.css';
```

组件只从包根入口导入。不要依赖 src/、dist/ 或内部组件路径。

## 基础示例

```tsx
<Input value={name} onChange={(event) => setName(event.target.value)} clearable />
```

## API

value/defaultValue；size；status；prefix；suffix；className；inputClassName；clearable；clearLabel；onClear；showCount。`showCount` 显示当前字数及可选 maxLength，并保留已有 aria-describedby 关联。`className` 用于输入框外壳的尺寸与布局，`inputClassName` 用于原生 input 的排版。Textarea 从同一模块导出。`autoResize` 根据内容与可用宽度自动增高，`minRows` / `maxRows` 控制范围，达到最大高度后内部滚动；关闭后恢复手动调整大小。`showCount` 显示当前字数和可选的 `maxLength`，通过 aria-describedby 与已有帮助/错误提示共同关联。回填或重置使用受控 value；组件不负责业务校验。

- **成熟度**：`beta`
- **支持平台**：web, pwa, android-webview, ios-wkwebview, windows-webview2, ssr
- **可访问性**：aria-invalid, focus-visible, label-compatible
- **主要 Token**：`--ec-color-border`, `--ec-color-focus`, `--ec-control-md`

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
export declare const Input: ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>>;

export declare interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix'
> {
  size?: ComponentSize;
  status?: InputStatus;
  prefix?: ReactNode;
  suffix?: ReactNode;
  inputClassName?: string;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  showCount?: boolean;
}

export declare type ComponentSize = 'sm' | 'md' | 'lg';

export declare type InputStatus = 'default' | 'error' | 'warning' | 'success';

export declare const Textarea: ForwardRefExoticComponent<
  TextareaProps & RefAttributes<HTMLTextAreaElement>
>;

export declare interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: InputStatus;
  /** Grow to fit the content, including controlled updates and width changes. */
  autoResize?: boolean;
  /** Row bounds used when autoResize is enabled. */
  minRows?: number;
  maxRows?: number;
  /** Show the current character count and maxLength, when supplied. */
  showCount?: boolean;
}
```

<!-- generated-api:end -->
