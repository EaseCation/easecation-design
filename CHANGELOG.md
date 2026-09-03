# Changelog

本项目遵循 Semantic Versioning。所有重要变更都会记录在此文件中。

## 0.4.0 - 2026-09-04

- 强化 Modal、Drawer 与 ResponsiveOverlay 的移动端布局，支持 Visual Viewport、软键盘、Safe Area、长内容滚动和真正的移动端全屏 Modal。
- 为无标题 Modal 与 Drawer 增加 `ariaLabel`，并为 Drawer 增加 `style`，保留既有公开 API 与兼容层调用方式。
- 统一浮层层级和暗色主题继承，提升触控设备上的点击目标、筛选栏、操作栏、日期时间与表单底栏布局。
- 为 Navbar 与 ResponsiveOverlay 补充正式 Storybook 场景，并增加移动端浮层回归测试。

## 0.1.0 - Unreleased

- 建立完整的 Design Tokens、主题、密度和 CSS Variables 系统。
- 提供基础、布局、导航、数据录入、数据展示、反馈与复合模式组件。
- 提供 Light、Dark、System 和 Black Gold 主题。
- 建立 Storybook、单元测试、视觉回归、组件注册表和 AI Native 工具链。
- 提供 SSR、Safe Area、虚拟键盘、Overlay Stack 和可选平台 Adapter。
- 提供 ESM、TypeScript 类型、Tree Shaking、npm 包检查与通用消费者示例。
