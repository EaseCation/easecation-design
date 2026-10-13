# Design Tokens 与主题

Token 分为 color、typography、spacing、radius、shadow、border、size、breakpoint、z-index、motion、opacity、touch target 和 safe area。`src/tokens/contract.json` 是 CSS 和 TypeScript 变量的共同来源；修改后运行 `pnpm tokens:generate`，CI 通过 `pnpm tokens:check` 检查漂移。

消费者通过 `ThemeProvider.tokens` 或自己的 CSS 作用域覆盖变量。不要依赖具体 OKLCH 值表达业务意义，应选择 primary、surface、danger 等语义 Token。

应用代码可以从独立入口读取 typed token contract，避免加载组件入口：

```ts
import { defaultTokens, type ThemeOverrides } from '@easecation/design/tokens';
```

字体文件不是设计系统运行时依赖。需要 Outfit 或 Geist Variable 时由应用显式加载；使用其他字体时覆盖 `--ec-font-sans` 与 `--ec-font-mono`。

`density="compact"` 将默认控件高度缩小至 comfortable 的 87.5%；显式覆盖 `--ec-control-*` 时使用覆盖后的高度。触控环境继续满足最小触控区域要求。

ThemeProvider 不设置页面高度、背景或 overflow。应用在自己的布局根节点设置这些属性，局部主题不会改变页面滚动。
