# 视觉一致性验证规范

EaseCation Design 的视觉事实由 Design Tokens、组件实现、Storybook 和自动截图回归共同维护。公共组件不能直接套用第三方设计系统的默认样式。

## 确定性验证

- `migration/manifest.json` 保存开发期源文件哈希与实现映射。
- Token 快照用于检测主题值意外偏移。
- Console 的调色板已由公共包统一提供；源文件仅保留 Tailwind 映射。快照保留原迁移哈希，并记录本次审查后的映射文件哈希。
- `pnpm visual:migration:check` 校验视觉基线和组件来源哈希。
- `pnpm visual:compare` 对桌面和移动视口执行同场景截图比较。

内部参考路由和截图 fixture 仅用于开发期验证，不进入 npm 运行时产物，也不构成公共组件命名的一部分。Storybook、README 和组件文档必须使用正式组件名与领域中立示例。
