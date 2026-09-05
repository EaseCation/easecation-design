# Design Tokens 与主题

Token 分为 color、typography、spacing、radius、shadow、border、size、breakpoint、z-index、motion、opacity、touch target 和 safe area。CSS 合约位于 `src/styles/tokens.css`，TypeScript 合约位于 `src/tokens/index.ts`。

消费者通过 `ThemeProvider.tokens` 或自己的 CSS 作用域覆盖变量。不要依赖具体 OKLCH 值表达业务意义，应选择 primary、surface、danger 等语义 Token。

应用代码可以从独立入口读取 typed token contract，避免加载组件入口：

```ts
import { defaultTokens, type ThemeOverrides } from '@easecation/design/tokens';
```

字体文件不是设计系统运行时依赖。需要 Outfit 或 Geist Variable 时由应用显式加载；使用其他字体时覆盖 `--ec-font-sans` 与 `--ec-font-mono`。
