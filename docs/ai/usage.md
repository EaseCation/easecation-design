# AI 使用指南

运行 `pnpm ai:context` 更新 `llms.txt`，运行 `pnpm ai:validate` 执行确定性检查。Storybook MCP 属于后续可选开发集成；接入时只暴露 Story 与文档，不暴露环境变量、Token 或内部服务。

设计相关工作先读 [UI governance](../guide/governance.md)，再查注册表、公开类型与 Storybook。

跨仓库接入或修复回归时，再读 [Agent integration lessons](./integration-lessons.md)：其中记录发布版本漂移、滚动、侧栏动效、语义颜色及浏览器验收中反复出现的问题，并给出适用条件和验证方法。

`pnpm ai:validate` 是快速检查，不能替代仓库要求的完整检查。迁移后还需执行消费者的规定检查，确保移除局部重复实现。AI 索引通过 `scripts/generate-ai-context.mjs` 生成，规则改动应更新生成器后重新生成，不能只手改 `llms.txt`。
