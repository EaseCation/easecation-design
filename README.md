# EaseCation Design

EaseCation Design 是由 EaseCation 发起并维护的企业级 React 设计系统与组件库。它提供领域中立、可组合、可主题化的组件，可用于管理后台、内容平台、社区、电商、工具、物联网和跨端 Web 应用。

组件库不会要求使用 EaseCation 的 Logo、商标或业务模型。使用方可以完整替换颜色、字体、圆角、阴影、密度和动效，同时保留一致的组件 API、可访问性和跨端行为。

## 特性

- React、TypeScript、Vite，输出 ESM 与 TypeScript 类型声明。
- CSS Variables 驱动的颜色、排版、间距、圆角、阴影、尺寸、断点、层级、动效和 Safe Area Tokens。
- Light、Dark、System 与 Black Gold 主题，支持品牌 Token 覆盖和密度配置。
- 覆盖基础、布局、导航、数据录入、数据展示、反馈和复合业务模式。
- 支持键盘、Focus Visible、Pointer Events、触摸操作和语义化 ARIA。
- SSR 安全导入，普通 Web 项目不依赖 Capacitor。
- 支持 PWA、Android WebView、iOS WKWebView 和 Windows WebView2 的 Web 层适配。
- 提供 Storybook、Vitest、组件注册表、JSON Schema、组件生成器和 `llms.txt`。

## 安装

```bash
pnpm add @easecation/design
```

## 使用

```tsx
import { Button, ThemeProvider } from '@easecation/design';
import '@easecation/design/style.css';

export function App() {
  return (
    <ThemeProvider mode="system">
      <Button>开始使用</Button>
    </ThemeProvider>
  );
}
```

组件支持从根入口按需导入，打包产物保留 ESM Tree Shaking 能力。React 和 React DOM 作为 `peerDependencies`，不会重复打入组件库产物。

正式组件只从根入口导出。Typed Tokens 使用独立入口：

```ts
import { defaultTokens, type ThemeOverrides } from '@easecation/design/tokens';
```

兼容 API 与正式组件隔离。已有项目需要兼容组件时显式使用 `@easecation/design/compat`；Ant Design 兼容符号使用 `@easecation/design/compat/antd`：

```ts
import { Alert, ConfigProvider } from '@easecation/design/compat/antd';
```

## 主题定制

```tsx
<ThemeProvider
  mode="dark"
  density="compact"
  tokens={{
    '--ec-color-primary': 'oklch(0.68 0.18 155)',
    '--ec-radius-lg': '1rem',
  }}
>
  <App />
</ThemeProvider>
```

所有公开 Token 都可以通过 CSS Variables 或 `ThemeProvider` 覆盖。建议优先覆盖语义 Token，而不是在组件内部写固定颜色和尺寸。

公共 CSS 不下载或内联字体。它声明 Outfit 与 Geist Variable 为默认字体名，并提供通用字体回退；应用可以使用自己的品牌字体，也可以自行安装并导入 `@fontsource-variable/outfit` 与 `@fontsource-variable/geist`。

`mode="system"` 在 SSR 输出中使用稳定的浅色快照，hydration 完成后同步系统偏好，以避免服务端与客户端属性不一致。需要首屏颜色完全确定时，应由应用根据服务端可用的用户设置显式传入 `light` 或 `dark`。

## WebView 与 Capacitor

核心包只使用标准 React、DOM 和 CSS。Safe Area 使用 `env(safe-area-inset-*)`；Android 返回键可以调用 `closeTopOverlay()`；虚拟键盘布局可以使用 `observeKeyboardViewport()`。

相机、权限、文件系统和原生状态栏由宿主通过可选 `PlatformAdapter` 接入，普通 Web 消费者无需安装 Capacitor。

## 开发

```bash
pnpm install
pnpm dev
pnpm check
```

面向消费者的变更使用 `pnpm changeset` 添加发布记录。`pnpm check` 包含格式、registry、开放源代码边界、类型、Lint、测试、构建、Storybook、npm 包和示例应用检查。

AI 辅助研发命令：

```bash
pnpm generate:component ComponentName
pnpm registry:check
pnpm ai:context
pnpm ai:validate
```

消费端可使用 `@easecation/design/eslint` 的 flat-config 规则，禁止原生 UI 控件、设计组件视觉覆盖和新增兼容层依赖。完整治理策略见 `docs/guide/governance.md`。

## 文档

- 官网：<https://design.easecation.net/>；Storybook：<https://design.easecation.net/storybook/>。
- 接入与研发教程位于 `docs/guide/`。
- 组件 API 和使用说明位于 `docs/components/`。
- 跨端适配说明位于 `docs/cross-platform/`。
- AI Native 架构与使用规范位于 `docs/ai/`。
- Storybook 是组件示例、交互状态和组合模式的事实来源。

## 发布

维护者先合并由 `pnpm version-packages` 生成的版本提交，再手动运行 `Publish npm package` 工作流并输入该提交的完整 SHA。工作流会检出精确提交、重跑完整质量门禁、确认 changeset 已消费且版本尚未发布，然后通过 npm token 发布公共包；源仓库公开时同时发布 provenance。仓库提交或 CI 成功本身不会自动发布。

包遵循 SemVer。Breaking Changes、废弃 API 和迁移说明必须记录在 Changesets 与 `CHANGELOG.md` 中。

## 开源与品牌

代码采用 MIT License。EaseCation 名称、Logo、商标、专属插画及其他品牌资产不随 MIT License 授权，详见 `TRADEMARKS.md` 和 `NOTICE`。

参与贡献前请阅读 `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md` 和 `SECURITY.md`。

Linux 构建、检查与部署默认在 `ec-bbdev` 的隔离 runner 执行，GitHub 仅负责触发与展示结果。`WEB_ACTIONS_RUNNER=bbdev`（默认）或旧值 `auto` 均不自动回退 GitHub 收费机器；本机不可用时任务排队。`github` 仅保留为人工明确选择的覆盖项。路由不再需要 SSH 探测密钥。仅同仓库分支与 PR 可使用长期 runner；外部 fork PR 与 `pull_request_target` 会跳过，不能据此认定验证通过。公开仓库同时在 GitHub 设置层要求所有外部贡献者的工作流先经审批；源码中的条件判断不能单独作为隔离边界，审批时不得允许 fork 通过修改 runner 选择进入长期虚拟机。部分完成的部署必须核对状态后再重试。npm provenance 发布保持原流程；artifact/cache 存储仍可能收费。 Storybook 使用经审查的共享 action 快照，版本及校验值记录在 `.github/actions/design-storybook/upstream.json`；仅发布 Storybook 子目录，不需要读取私有仓库。
