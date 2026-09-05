# 贡献指南

感谢参与 EaseCation Design。项目接受缺陷修复、可访问性改进、领域中立的新组件、文档和工具链改进。安全问题请按 `SECURITY.md` 私下报告，不要提交公开 Issue。

## 开发环境

- Node.js 20.19 或更高版本。
- Corepack 与仓库声明的 pnpm 版本。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## 变更范围

- 公开 Props、示例、registry 与文档必须保持领域中立，不依赖 EaseCation 私有服务、凭据、业务模型或受限资产。
- 模块初始化必须保持 SSR 安全；浏览器全局只在 effect、事件处理器或显式函数中访问。
- Capacitor 与原生能力必须通过可选 adapter 接入。
- 视觉值优先使用 Design Tokens；新增 Token 时同步 typed contract 与 CSS 变量。
- 正式组件使用规范名称。兼容 API 只能放在明确的兼容子路径中，不得覆盖根入口。

## 组件流程

先检查 `registry/components.json` 是否已有相同能力。新组件使用：

```bash
pnpm generate:component ComponentName
```

提交应同时覆盖公开导出、类型、样式、键盘和 ARIA 行为、响应式状态、单元测试、Storybook、中文文档与 registry 元数据。保持改动聚焦，不在同一 PR 中混入无关重构。

## 提交前检查

```bash
pnpm check
```

该命令会检查格式、registry、开放源代码边界、类型、Lint、测试、包构建、Storybook、npm 打包内容和示例应用。所有生成文件也应处于最新状态。

面向消费者的修复或功能需运行 `pnpm changeset`。0.x 阶段移除或改变公开 API 使用 minor changeset；纯内部维护且不影响发布物时可以不添加，但需在 PR 中说明。

## Pull Request

PR 描述应包含问题背景、公开行为变化、验证命令以及必要的截图或迁移说明。维护者会重点审查 API 一致性、可访问性、SSR、包体积、跨端行为和开源边界。AI 生成的修改与其他修改遵循同一标准，必须经过确定性检查和人工审查。
