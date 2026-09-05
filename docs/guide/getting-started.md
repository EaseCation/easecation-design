# 接入教程

安装包并在应用入口引入 `@easecation/design/style.css`。最外层使用 `ThemeProvider`，业务页面优先组合语义组件而不是覆盖内部 DOM。SSR 框架可直接导入；模块初始化不会读取浏览器全局。`mode="system"` 的服务端快照固定为浅色，hydration 后再同步系统偏好；服务端已知用户偏好时可直接传入 `light` 或 `dark`。

按需加载可由现代 ESM Bundler 自动 Tree Shaking。正式组件从包根入口导入；公开子路径包括 `./style.css`、`./tokens`、`./compat`、`./compat/antd` 与 `./package.json`。兼容入口不会覆盖根入口中的正式组件。

公共 CSS 不包含字体文件或远程字体请求。消费方可以沿用系统回退字体、覆盖 `--ec-font-sans` 与 `--ec-font-mono`，或自行安装并导入所需字体资源。
