# Design Tokens 与主题

Token 分为 color、typography、spacing、radius、shadow、border、size、breakpoint、z-index、motion、opacity、touch target 和 safe area。CSS 合约位于 `src/styles/tokens.css`，TypeScript 合约位于 `src/tokens/index.ts`。

消费者通过 `ThemeProvider.tokens` 或自己的 CSS 作用域覆盖变量。不要依赖具体 OKLCH 值表达业务意义，应选择 primary、surface、danger 等语义 Token。