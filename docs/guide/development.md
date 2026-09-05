# 研发教程

组件流程：Discover → Specify → Scaffold → Implement → Validate → Inspect → Review → Record。先查 `registry/components.json`，再运行 `pnpm generate:component Name`。完成 Props、Ref、受控状态、键盘、ARIA、Pointer、响应式、Story、单测和中文文档后才能从 experimental 提升为 beta。

样式只能使用 `--ec-*` 语义 Token。复杂交互需清理监听器、计时器与 Observer。任何浏览器全局必须在 effect、事件处理器或显式函数内访问。
