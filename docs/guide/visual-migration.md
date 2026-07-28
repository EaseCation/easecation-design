# Console Neo 视觉迁移规范

本项目不是模仿 Console Neo，也不是根据截图重新设计。`easecation-console-neo` 是视觉事实来源，目标是迁移其设计语言，同时移除业务耦合。

## 可追踪来源

- `migration/manifest.json` 记录每类组件的源文件。
- `migration/console-neo.tokens.json` 保存源 Token 快照和 SHA-256。
- `pnpm visual:migration:check` 校验浅色、暗色和黑金主题值是否发生偏移。
- `src/tokens/consoleNeo.ts` 向 TypeScript 消费者提供同一份机器可读事实。

公共组件可以扩展领域中立 API，但默认尺寸、颜色、圆角、阴影、字体、状态和动效不得脱离源组件。无法直接迁移的部分必须在迁移清单中说明原因，而不能用其他设计系统默认值替代。

## 本地截图验证流程

1. 安装临时 Console Neo 参考路由：`pnpm visual:fixtures:install`。
2. 启动 Console Neo (`8002`) 和 Storybook (`6006`)。
3. 执行全部场景：`pnpm visual:compare`。
4. 只验证指定场景：`VISUAL_SCENES=app-shell,toast pnpm visual:compare`（PowerShell 使用 `$env:VISUAL_SCENES=...`）。
5. 验证完成后执行 `pnpm visual:fixtures:cleanup`，保证 Console Neo 工作区恢复干净。

参考路由源文件保存在 `migration/console-neo-reference-routes/`，仅用于开发期视觉验证，不进入 npm 运行时产物。
