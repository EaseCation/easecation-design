# 接入教程

安装包并在应用入口引入 `@easecation/design/style.css`。最外层使用 `ThemeProvider`，业务页面优先组合语义组件而不是覆盖内部 DOM。SSR 框架可直接导入；只有组件挂载后才会读取 `matchMedia`、`document` 或 `visualViewport`。

按需加载可由现代 ESM Bundler 自动 Tree Shaking。当前公开子路径为 `./style.css`、`./tokens` 与 `./package.json`；组件级稳定子路径将在 API 稳定后开放。