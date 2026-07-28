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

## WebView 与 Capacitor

核心包只使用标准 React、DOM 和 CSS。Safe Area 使用 `env(safe-area-inset-*)`；Android 返回键可以调用 `closeTopOverlay()`；虚拟键盘布局可以使用 `observeKeyboardViewport()`。

相机、权限、文件系统和原生状态栏由宿主通过可选 `PlatformAdapter` 接入，普通 Web 消费者无需安装 Capacitor。

## 开发

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm build:storybook
pnpm pack:check
pnpm check
```

AI 辅助研发命令：

```bash
pnpm generate:component ComponentName
pnpm registry:check
pnpm ai:context
pnpm ai:validate
```

## 文档

- 接入与研发教程位于 `docs/guide/`。
- 组件 API 和使用说明位于 `docs/components/`。
- 跨端适配说明位于 `docs/cross-platform/`。
- AI Native 架构与使用规范位于 `docs/ai/`。
- Storybook 是组件示例、交互状态和组合模式的事实来源。

## 发布

`.github/workflows/release.yml` 提供 `workflow_dispatch` 手动发布流程。发布前会执行许可证检查、类型检查、Lint、测试、构建和 npm 包内容验证。

包遵循 SemVer。Breaking Changes、废弃 API 和迁移说明必须记录在 Changesets 与 `CHANGELOG.md` 中。

## 开源与品牌

代码采用 MIT License。EaseCation 名称、Logo、商标、专属插画及其他品牌资产不随 MIT License 授权，详见 `TRADEMARKS.md` 和 `NOTICE`。

参与贡献前请阅读 `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md` 和 `SECURITY.md`。
