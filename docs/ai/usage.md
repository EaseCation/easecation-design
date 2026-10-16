# AI 使用指南

运行 `pnpm ai:context` 更新 `llms.txt`，运行 `pnpm ai:validate` 执行确定性检查。Storybook MCP 属于后续可选开发集成；接入时只暴露 Story 与文档，不暴露环境变量、Token 或内部服务。

设计相关工作先读 [UI governance](../guide/governance.md)，再查注册表、公开类型与 Storybook。

`pnpm ai:validate` 是快速检查，不能替代仓库要求的完整检查。迁移后还需执行消费者的规定检查，确保移除局部重复实现。AI 索引通过 `scripts/generate-ai-context.mjs` 生成，规则改动应更新生成器后重新生成，不能只手改 `llms.txt`。
