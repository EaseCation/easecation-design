# EaseCation Design

EaseCation Design 是由 EaseCation 发起的 React 设计系统与组件库。默认视觉语言源自 `easecation-console-neo`，但组件 API、Token、示例和运行时保持领域中立，可用于后台、内容、社区、电商、工具和物联网应用。

> 当前版本为首个 beta 基础实现。视觉 Token 已完成提取，核心组件可构建和测试；更多组件将按注册表成熟度逐步交付。

## 特性

- React + TypeScript + Vite，ESM 与类型声明输出。
- OKLCH 语义颜色、间距、圆角、阴影、尺寸、断点、层级、动效和 Safe Area Token。
- Light、Dark、System 与密度配置，支持完整 CSS Variables 覆盖。
- Button、IconButton、Input、Textarea、FormItem、Layout、SafeArea、Tabs、Modal、Drawer、Toast 等首批组件。
- SSR 安全导入，普通 Web 项目不依赖 Capacitor。
- Overlay Stack、Visual Viewport 观察器与可选 Platform Adapter 接口。
- Storybook、Vitest、注册表 Schema、组件生成器和 `llms.txt`。

## 安装

```bash
pnpm add @easecation/design
```

```tsx
import { Button, ThemeProvider } from '@easecation/design';
import '@easecation/design/style.css';

export function App() {
  return <ThemeProvider mode="system"><Button>开始使用</Button></ThemeProvider>;
}
```

## 主题

```tsx
<ThemeProvider
  mode="dark"
  density="compact"
  tokens={{ '--ec-color-primary': 'oklch(0.68 0.18 155)', '--ec-radius-lg': '1rem' }}
>
  <App />
</ThemeProvider>
```

## WebView 与 Capacitor

核心包只使用标准 React、DOM 和 CSS。Safe Area 使用 `env(safe-area-inset-*)`；Android 返回键可调用 `closeTopOverlay()`；键盘布局可使用 `observeKeyboardViewport()`。相机、权限、文件系统、状态栏由宿主实现 `PlatformAdapter`，不会强迫普通 Web 消费者安装 Capacitor。

## 开发

```bash
pnpm install
pnpm dev
pnpm visual:migration:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm build:storybook
pnpm pack:check
```

AI 开发流程使用 `pnpm generate:component Name`、`pnpm registry:check`、`pnpm ai:context` 和 `pnpm ai:validate`。

## 发布

`.github/workflows/release.yml` 仅支持 `workflow_dispatch` 手动触发，从 `NPM_TOKEN` 读取凭据。未经维护者明确授权不得推送、创建正式版本或执行 `npm publish`。

## 开源和品牌

代码采用 MIT License。EaseCation 名称、Logo、商标、专属插画及未明确授权的品牌资产不随 MIT License 授权，详见 `TRADEMARKS.md` 和 `NOTICE`。贡献前请阅读 `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md` 与 `SECURITY.md`。