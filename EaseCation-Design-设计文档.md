# EaseCation Design 设计文档

> 源自 `easecation-console-neo` 的视觉语言，将其系统化、组件化为一套可开源、可主题化，并适用于通用 Web、Android、iOS 与 Windows 应用的 React UI 组件库。

## 1. 文档信息

| 项目 | 内容 |
| --- | --- |
| 项目名称 | EaseCation Design |
| GitHub 组织 | EaseCation |
| 仓库名称 | `easecation-design` |
| 建议 npm 包名 | `@easecation/design` |
| 项目描述 | EaseCation 自研设计组件/UI包 |
| 参考项目 | `E:\EaseCation\WebProject\easecation-console-neo` |
| 目标项目 | `E:\EaseCation\WebProject\easecation-design` |
| 主要技术 | React、TypeScript、Vite、CSS Variables、Storybook、Vitest |
| 目标平台 | Web、PWA、Android WebView、iOS WKWebView、Windows WebView2 |
| 发布定位 | 面向社区公开发布，可用于后台、内容、社区、电商、工具、物联网等不同领域 |
| 建议许可证 | MIT（正式采用前需完成源码、字体、图标和品牌资产的权利审查） |

## 2. 项目背景

`easecation-console-neo` 已经形成了具有 EaseCation 品牌特征的页面结构、色彩体系、组件外观和交互方式，但这些能力目前主要服务于单一业务项目，存在以下问题：

- UI 与业务代码耦合，难以直接在其他项目中复用。
- 样式变量、组件状态和响应式规则没有形成统一设计系统。
- 不同项目重复实现按钮、表单、卡片、导航和弹层，容易产生视觉差异。
- Web、移动端 WebView 和桌面 WebView 的交互环境不同，缺少统一适配层。
- 缺少独立的组件文档、开发规范、测试体系和 npm 发布流程。

因此，需要将 `easecation-console-neo` 的 UI 从业务项目中提取出来，建设一套源自 EaseCation、但不局限于 EaseCation 平台和单一业务领域的开源设计系统与组件库。默认主题保留其视觉特征，组件 API、语义 Token、文档和扩展机制则面向通用社区使用场景设计。

## 3. 项目目标

### 3.1 核心目标

1. 将 `easecation-console-neo` 的 UI 视觉语言完整提取为 Design Tokens。
2. 将通用 UI 和交互拆分为独立、可配置、可测试的 React 组件。
3. 建立一致的组件 API、主题配置、响应式规则和无障碍规范。
4. 支持 PC、平板、手机及横竖屏布局。
5. 支持 Capacitor 等 React 跨端容器中的 Android、iOS 和 Windows 应用。
6. 通过公开 npm 包向 EaseCation 项目、第三方项目和开源社区提供统一接入能力。
7. 通过语义化 Token、主题覆盖和平台 Adapter 支持后台、内容、社区、电商、工具、物联网等不同领域。
8. 建立清晰的开源许可证、贡献规范、行为准则、安全政策和版本兼容策略。
9. 通过 Storybook、中英文入口文档、中文详细文档和测试降低使用与维护成本。
10. 从项目初期建立 AI Native 的设计、研发、文档和验证流程。
11. 通过手动 GitHub Actions 工作流安全发布 npm 包。

### 3.2 非目标

本项目不负责：

- 迁移 `easecation-console-neo` 的完整业务功能。
- 携带业务 API、权限、登录、路由或业务状态管理。
- 重新设计一套与 `easecation-console-neo` 不同的视觉风格。
- 直接复制 ?????、Material Design 等第三方组件库源码。
- 在组件库中强制依赖 Capacitor 原生插件。
- 将 EaseCation Logo、商标或其他受限品牌资产默认视为开源代码许可证的一部分。
- 为特定行业硬编码服务器、玩家、商城、订单、文章等业务模型。
- 未经授权自动推送代码或发布正式 npm 版本。

## 4. 设计思路

### 4.1 以 console-neo 为视觉事实来源

`easecation-console-neo` 是本组件库的唯一视觉事实来源。????? 仅用于参考成熟组件库的分类、API 一致性、类型设计、无障碍能力和文档组织方式。

开发前应先分析参考项目中的：

- 品牌颜色、背景层级和状态色。
- 字体、字号、字重和行高。
- 间距、圆角、边框和阴影。
- Header、Sidebar、Content 等页面布局。
- Button、Input、Card、Table、Modal 等组件状态。
- hover、active、focus、selected、disabled、loading 和 error 状态。
- 桌面端、平板和移动端断点及布局变化。
- 动画时长、缓动函数、浮层层级和滚动行为。

不应先创建一套通用模板，再将颜色替换为 EaseCation 品牌色；而应从真实页面和样式中反向归纳设计规则。

### 4.2 先提取设计系统，再实现组件

推荐采用以下顺序：

1. 盘点参考项目中的全局样式和高频 UI 模式。
2. 将重复出现的视觉值归纳为 Design Tokens。
3. 建立主题、尺寸、断点、层级和动画基础设施。
4. 实现基础组件和布局组件。
5. 实现表单、展示和反馈组件。
6. 最后将参考项目中的高价值复合界面抽象为行业中立的通用组件，并将 EaseCation 品牌预设作为可选主题或示例层提供。

这样可以避免每个组件单独复制样式，降低后期主题调整成本。

### 4.3 UI 与业务彻底解耦

从 `easecation-console-neo` 提取组件时，应删除或抽象以下依赖：

- 网络请求和后端接口。
- 用户、权限和登录状态。
- 路由跳转和页面级生命周期。
- Redux、Zustand 等业务 Store。
- 固定业务文案和数据结构。
- 原项目专属的服务器或玩家业务模型。

组件通过 Props、事件回调、Slot、Context 或 Render Props 接收数据和行为。例如，服务器状态卡片只负责展示，不负责请求服务器状态。

### 4.4 开源与领域中立

组件库虽然源自 EaseCation Console Neo，但公共 API 和组件命名不应绑定特定平台、游戏或业务领域。设计时应遵循：

- 使用 `status`、`metric`、`entity`、`item`、`record` 等通用语义，避免把 `server`、`player`、`console` 等领域词写入基础层。
- 默认主题保留 Console Neo 的设计语言，同时允许使用方通过语义 Token 创建自己的品牌主题。
- EaseCation Logo、名称和专属插图应与通用组件代码分离；商标使用权不随开源代码许可证自动授予。
- 公共组件不得依赖 EaseCation 域名、接口、账号体系、埋点或内部基础设施。
- 对第三方源码、字体、图标、图片和依赖执行许可证审查，并保留必要的版权声明。
- 使用 SemVer 管理版本，记录 Breaking Changes，并为废弃 API 提供迁移说明。
- 提供 `LICENSE`、`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md` 和变更日志。

开源的含义是允许社区在不同领域使用和扩展组件库，而不是移除 EaseCation 的设计来源说明。

### 4.5 平台中立、按需增强

核心组件库应基于标准 React 和 Web API 实现，普通 Web 项目不需要安装 Capacitor。

对于状态栏、原生返回键、键盘、相机、文件系统等原生能力，采用 Adapter 设计：

```text
业务应用
   |
   +-- Web Adapter
   +-- Capacitor Adapter
   +-- 自定义宿主 Adapter
             |
        EaseCation Design
```

组件库提供接口与默认 Web 实现，宿主应用根据平台注入 Capacitor 或其他原生实现。

### 4.6 可访问、可测试、可扩展

组件不能只追求视觉还原，还需要具备：

- 完整 TypeScript 类型。
- 统一的受控和非受控模式。
- Ref 转发。
- 键盘操作和 Focus Visible。
- 正确的 HTML 语义和 ARIA 属性。
- 组件卸载后的资源清理。
- 单元测试和 Storybook 示例。
- 根入口与按需入口。
- 可覆盖但不破坏封装的样式能力。

## 5. 技术架构

### 5.1 推荐技术栈

| 类型 | 推荐方案 |
| --- | --- |
| UI 框架 | React + TypeScript |
| 构建工具 | Vite Library Mode |
| 包管理器 | pnpm |
| 样式方案 | CSS Variables + CSS Modules/规范化 CSS |
| 组件预览 | Storybook |
| 单元测试 | Vitest + React Testing Library |
| 代码质量 | ESLint + Prettier |
| 版本管理 | Changesets |
| CI/CD | GitHub Actions |
| AI Native | AGENTS.md、机器可读组件注册表、Storybook MCP、生成器与自动验证 |

若目标目录已经存在合理技术栈，应优先延续已有配置，避免无理由重构。

### 5.2 包产物

组件库发布产物应具备：

- ESM 构建。
- TypeScript 声明文件。
- 根入口导入和组件级按需导入。
- 可被 Tree Shaking 的模块结构。
- 独立且可正确加载的样式文件。
- 正确的 `package.json#exports`。
- React、React DOM 作为 `peerDependencies`。
- 排除测试、Storybook、开发脚本等非发布内容。

### 5.3 建议目录

```text
src/
  components/
  hooks/
  icons/
  styles/
  theme/
  tokens/
  adapters/
    capacitor/
  ai/
    registry/
    schemas/
  platform/
  utils/
  index.ts

docs/
  introduction/
  guide/
  development/
  components/
  responsive/
  cross-platform/
  capacitor/
  publishing/

examples/
  web/
  generic-dashboard/
  capacitor/

scripts/
  ai/

tests/
.storybook/
.github/workflows/
```

组件目录建议：

```text
src/components/Button/
  Button.tsx
  Button.types.ts
  Button.css
  Button.test.tsx
  Button.stories.tsx
  index.ts
```

## 6. Design Tokens

至少建立以下 Token 分类：

| 分类 | 内容 |
| --- | --- |
| Color | 品牌色、文本色、背景色、边框色、状态色 |
| Typography | 字体族、字号、字重、行高、字间距 |
| Spacing | 页面、容器、组件和元素间距 |
| Radius | 控件、卡片、浮层的圆角等级 |
| Shadow | 卡片、下拉菜单、Modal 等阴影 |
| Border | 边框宽度、颜色和样式 |
| Size | 控件高度、图标尺寸、容器尺寸 |
| Breakpoint | 手机、平板、桌面、宽屏断点 |
| Z-index | 导航、下拉、遮罩、Modal、Toast 层级 |
| Motion | 时长、缓动函数和过渡类型 |
| Touch target | 移动端最小可触摸区域 |
| Safe area | 顶部、底部和左右安全区域 |

Token 应同时提供 CSS Variables 和 TypeScript 类型，并由 `ThemeProvider` 或 `ConfigProvider` 管理。

## 7. 组件规划

### 7.1 基础组件

- Button
- IconButton
- Typography
- Link
- Divider
- Space
- Flex
- Grid
- Container
- Surface
- Portal

### 7.2 布局组件

- Layout
- Header
- Sidebar
- Content
- Footer
- PageContainer
- PageHeader
- ResponsiveGrid
- SafeArea
- BottomBar

### 7.3 导航组件

- Menu
- Breadcrumb
- Tabs
- Pagination
- Dropdown
- MobileNavigation

### 7.4 数据录入组件

- Input
- Textarea
- InputNumber
- Select
- Checkbox
- Radio
- Switch
- Slider
- Search
- Form
- FormItem
- Upload
- DatePicker（以参考项目实际设计为准）

### 7.5 数据展示组件

- Avatar
- Badge
- Tag
- Card
- Statistic
- List
- Table
- Empty
- Skeleton
- Tooltip
- Collapse
- Descriptions

### 7.6 反馈组件

- Alert
- Message
- Notification
- Modal
- Drawer
- ActionSheet
- Popover
- Popconfirm
- Progress
- Spin
- Result
- Toast

### 7.7 通用复合组件与 EaseCation 主题示例

具体以 `easecation-console-neo` 中真实存在的模块为设计来源，但对外导出时应抽象为领域中立组件。例如可评估：

- ProfilePanel：通用资料信息面板。
- MetricCard：通用数据指标卡片。
- StatusCard：通用实体或服务状态卡片。
- StatusBadge：通用状态标记。
- ActionPanel：通用快捷操作面板。
- AppNavigation：可配置应用导航。
- MobileActionPanel：移动端操作面板。

EaseCation 品牌主题和示例可以展示 Console Neo 的实际风格，但公共组件不得硬编码业务数据、品牌 Logo、域名或特定行业模型。

## 8. 组件 API 规范

组件 API 应尽量保持一致：

```ts
interface CommonComponentProps {
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
  variant?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}
```

涉及状态的组件应明确支持：

- `value` / `defaultValue`
- `open` / `defaultOpen`
- `onChange`
- `onOpenChange`
- `onRequestClose`

每个正式组件应包含类型、样式、测试、Storybook 和中文说明，不应创建不可用的空壳组件。

## 9. 响应式设计

组件库应支持宽屏桌面、普通桌面、平板、横屏手机和竖屏手机。

关键要求：

- Layout 和 Grid 支持响应式配置。
- Sidebar 在窄屏下可折叠或转换为 Drawer。
- Table 支持横向滚动、紧凑模式或卡片模式。
- Modal 在移动端可全屏或接近全屏。
- Drawer 支持侧边和底部形态。
- Form 支持桌面横向、移动端纵向布局。
- Tabs、Pagination 和 Breadcrumb 在窄屏下不应严重溢出。
- 核心功能不能依赖 hover。
- 控件需具备合理的触摸区域。
- 支持横竖屏切换、字体缩放和动态视口高度。

## 10. Capacitor 与跨端适配

### 10.1 Safe Area

提供 `SafeArea` 组件或 Hook，支持：

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

Header、BottomBar、Modal、Drawer、ActionSheet 和 Toast 应正确避开刘海、Home Indicator、状态栏和导航栏。

### 10.2 虚拟键盘

需要处理：

- `visualViewport` 高度变化。
- 输入框被键盘遮挡。
- 底部操作栏位置变化。
- Modal、Drawer 内输入框聚焦。
- 键盘收起后的滚动恢复。
- 横竖屏切换后的视口恢复。

标准 Web API 作为默认实现，Capacitor Keyboard 通过可选 Adapter 接入。

### 10.3 Android 返回键

建立 Overlay Stack，允许宿主应用调用 `closeTopOverlay()`，优先关闭最上层 Modal、Drawer、ActionSheet 或 Popover。

组件库不直接强制监听 Capacitor App 插件，而是提供宿主接入接口。

### 10.4 多输入方式

同时支持鼠标、键盘、触摸、触控板、Pointer Events 和手写笔。不得全局禁用 `touch-action` 或文本选择，拖拽手势也不得破坏页面正常滚动。

### 10.5 WebView 性能

- 避免大型运行时样式系统。
- 减少无意义渲染和全局监听。
- 动画优先使用 `transform` 和 `opacity`。
- 避免高频同步布局和 Observer。
- 支持按需加载和 Tree Shaking。
- 为长列表和大型表格保留虚拟化扩展能力。

### 10.6 SSR 安全

不得在模块顶层无条件读取 `window`、`document`、`navigator`、`localStorage`、`matchMedia`、`visualViewport` 或 Observer API。

## 11. AI Native 设计与研发流程

AI Native 不是在项目完成后额外生成几份文档，而是从组件库立项开始，就让设计规则、组件 API、示例、测试和发布信息同时具备“人类可读”和“机器可读”两种表达，使 Codex 等 AI Agent 能够可靠地发现、选择、组合、生成和验证组件。

### 11.1 AI Native 目标

- AI 能理解组件库的视觉原则、架构边界和禁止事项。
- AI 能根据使用场景选择正确组件，而不是重复实现已有组件。
- AI 能读取组件 Props、Slots、Tokens、平台能力、无障碍要求和示例。
- AI 能按统一规范创建新组件，并同步生成测试、Story、文档和变更记录。
- AI 能使用浏览器与 Storybook 验证视觉、交互、响应式和可访问性。
- AI 生成的代码仍必须经过确定性工具和人工审查，不能绕过质量门禁。

### 11.2 AI 可读的单一事实来源

项目应维护以下 AI 上下文：

- 根目录 `AGENTS.md`：说明架构、目录、命令、代码规范、设计约束、跨端规则和禁止行为。
- `docs/ai/architecture.md`：描述组件层级、主题系统、Overlay、Adapter 和发布架构。
- `docs/ai/component-authoring.md`：描述新增组件的完整研发流程。
- `docs/ai/design-language.md`：描述 Console Neo 视觉语言与通用化边界。
- `src/ai/registry/components.json`：机器可读组件注册表。
- `src/ai/schemas/component.schema.json`：组件元数据 JSON Schema。
- `llms.txt`：提供精简的项目入口、文档索引和使用原则。
- 可选 `llms-full.txt`：由脚本生成完整文档上下文，避免手工维护重复内容。

组件注册表至少描述：

```json
{
  "name": "Button",
  "importPath": "@easecation/design",
  "category": "input",
  "status": "stable",
  "platforms": ["web", "android-webview", "ios-webview", "windows-webview"],
  "propsSchema": "./button.props.json",
  "tokens": ["color.primary", "size.control.medium"],
  "stories": ["basic", "loading", "mobile"],
  "accessibility": ["keyboard", "focus-visible", "accessible-name"],
  "deprecated": false
}
```

注册表应由代码或类型信息尽可能自动生成和校验，避免文档与实现长期漂移。

### 11.3 Storybook 与 MCP

将 Storybook 作为组件行为、示例和视觉状态的事实来源，并评估接入官方 Storybook MCP 能力，让支持 MCP 的 AI Agent 可以检索组件、Stories 和文档。

要求：

- Story 标题、参数和示例使用稳定、清晰的命名。
- 每个组件提供基础、状态、响应式、跨端和无障碍 Story。
- MCP 只提供开发辅助能力，不进入组件库运行时产物。
- 不向 AI 工具暴露 npm Token、私有环境变量或其他敏感信息。
- MCP 不可用时，AI 仍可通过静态注册表、Storybook 构建和文档完成开发。

### 11.4 AI 辅助研发闭环

推荐流程：

1. **Discover**：AI 读取 `AGENTS.md`、组件注册表、Design Tokens 和现有 Stories。
2. **Specify**：先生成或更新组件规格，明确 API、状态、平台、Token 和无障碍要求。
3. **Scaffold**：使用项目生成器创建组件、类型、样式、测试、Story 和文档骨架。
4. **Implement**：按照 Console Neo 设计语言和领域中立原则实现组件。
5. **Validate**：执行类型检查、Lint、单测、Storybook、可访问性、响应式和消费者导入测试。
6. **Inspect**：通过浏览器或 Storybook MCP 检查真实渲染结果和控制台错误。
7. **Review**：由人工确认视觉、API、许可证、品牌边界和 Breaking Change 风险。
8. **Record**：更新组件注册表、Changeset、文档和迁移说明。

建议提供以下命令，实际名称可根据工程调整：

```bash
pnpm generate:component
pnpm ai:context
pnpm ai:validate
pnpm registry:check
pnpm storybook
```

### 11.5 AI 生成约束

- AI 不得绕过现有组件另行实现相同能力。
- AI 不得把 Console Neo 的业务 API、私有地址或受限资产带入开源包。
- AI 不得自行修改许可证、发布权限、npm Token 或安全策略。
- AI 不得仅根据截图猜测交互，必须结合源码、样式、Story 和测试。
- AI 生成的 Props 必须保持领域中立、可组合和向后兼容。
- AI 生成的文档和注册表必须通过自动校验，示例代码必须可编译。
- AI 不得自动发布 npm 包；发布必须由人工通过 GitHub Actions 手动触发。

### 11.6 分阶段落地

第一阶段即实现 `AGENTS.md`、AI 文档目录、组件元数据 Schema、基础注册表和组件生成器，不等到组件库完成后再补。

第二阶段接入 Storybook MCP、自动生成 `llms.txt`、Props 元数据和文档索引。

第三阶段增加 AI 驱动的组件检索、主题生成、迁移建议和视觉回归辅助能力。所有 AI 判断必须由确定性测试和人工审查兜底。
## 12. 文档体系

### 12.1 README

根目录中文 README 应包括：

- 项目介绍和设计来源。
- 主要特性和技术栈。
- 支持环境和兼容范围。
- 安装、全量引入和按需引入。
- 主题与响应式配置。
- 开发、测试、构建和 Storybook 命令。
- npm 发布方式。
- 项目目录、开源许可证、贡献方式、行为准则、安全政策和商标说明。

### 12.2 独立教程

至少提供：

- 接入教程。
- 研发教程。
- 组件使用教程。
- Design Tokens 和主题教程。
- 响应式开发教程。
- Capacitor 跨端接入教程。
- 自定义品牌主题与非 EaseCation 项目接入教程。
- AI Native 架构、组件元数据、Agent 使用和自动验证教程。
- 开源贡献、兼容性和 API 废弃流程。
- npm 版本与发布教程。

所有文档示例必须与真实组件 API 和项目命令一致。

## 13. GitHub Actions 发布设计

发布工作流使用 `workflow_dispatch` 手动触发，不允许普通 push 自动发布正式版本。

建议流程：

1. Checkout。
2. 安装 Node.js 和 pnpm。
3. 根据锁文件安装依赖。
4. 执行类型检查、Lint 和测试。
5. 执行生产构建。
6. 检查 npm 包内容。
7. 更新 patch、minor、major 或 prerelease 版本。
8. 使用 `NPM_TOKEN` 发布到 npm。

如用户提供指定 GitHub Actions 脚本，应优先集成指定脚本；未提供时只能建立兼容工作流，不得声称已使用指定脚本。

## 14. 测试与验收

完成后至少执行：

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm build-storybook
npm pack
```

实际脚本名称以最终 `package.json` 为准。

验收重点：

- 根入口和按需入口可正常导入。
- 类型声明和样式产物正确。
- React 未被重复打包。
- Tree Shaking 可用。
- SSR 可以安全导入。
- 不包含本地绝对路径、密钥和业务 API。
- PC 和移动端无明显布局溢出。
- Modal、Drawer 不产生滚动穿透。
- Safe Area、虚拟键盘和 Overlay Stack 行为合理。
- README、教程和 Storybook 示例可运行。

## 15. 实施阶段

### 第一阶段：分析

- 检查两个项目及 Git 状态。
- 分析参考项目技术栈和 UI。
- 提取 Design Tokens 和组件清单。
- 区分通用 UI 与业务逻辑。

### 第二阶段：基础架构

从本阶段开始同步建立 AGENTS.md、AI 文档、组件元数据 Schema、注册表、生成器和 Storybook MCP 接入，不将 AI Native 能力推迟到项目末期。

- 初始化构建、测试和 Storybook。
- 建立主题、Token、响应式和平台基础设施。
- 建立 npm 导出和发布结构。

### 第三阶段：核心组件

- 先实现基础、布局和表单组件。
- 再实现展示、反馈和浮层组件。
- 最后实现 EaseCation 特色组件。
- 每组组件同步补充测试、示例和文档。

### 第四阶段：跨端验证

- 验证桌面与移动视口。
- 验证 Safe Area、键盘和浮层。
- 验证 SSR 和 WebView 风险。
- 没有原生工具链时，明确标注未执行真实原生构建。

### 第五阶段：发布准备

- 完善中文文档。
- 构建 Storybook。
- 执行 npm pack 和消费者项目测试。
- 添加手动 GitHub Actions 发布工作流。

## 16. 风险与约束

| 风险 | 应对方式 |
| --- | --- |
| console-neo 样式与业务高度耦合 | 通过 Props、事件和 Adapter 重构 |
| 组件数量过多导致质量下降 | 分优先级交付，禁止空壳组件 |
| Web 与 WebView 行为差异 | 标准 Web 实现 + 可选平台 Adapter |
| 无真实设备环境 | 完成 Web 层验证并明确未验证项 |
| 指定发布脚本未提供 | 先建立兼容工作流，等待替换或合并 |
| npm/GitHub 权限不足 | 完成本地开发并给出人工操作步骤 |
| 视觉还原偏差 | 使用 Storybook 与参考页面逐项对照 |
| AI 生成内容与实现漂移 | 由类型、Schema、注册表检查和可编译示例自动校验 |
| AI 引入业务或受限资产 | 在 Agent 规则、许可证检查和人工审查中明确阻断 |

---

# 17. Codex 执行 Prompt

以下内容可以直接复制给 Codex（GPT-5.6）执行。

```text
你是一名资深前端开发工程师、React 组件库架构师、设计系统工程师和跨端应用开发工程师。

现在需要开发一套类似 ????? 的企业级 React UI 组件库。该项目不是重新设计一套 UI，而是将现有 easecation-console-neo 项目的 UI 设计、布局、交互和品牌视觉系统化、组件化，并拆分到独立仓库中。组件库源自 EaseCation，但必须能够开源发布，不局限于 EaseCation 平台，并可用于后台、内容、社区、电商、工具、物联网等不同领域。

请直接检查本地项目、创建和修改文件、实现组件、编写测试和文档，并完成构建验证。不要只提供方案、伪代码或少量示例。

## 项目信息

- 项目名称：EaseCation Design
- GitHub 组织：EaseCation
- GitHub 仓库：easecation-design
- 项目描述：EaseCation 自研设计组件/UI包
- 建议 npm 包名：@easecation/design
- 参考项目：E:\EaseCation\WebProject\easecation-console-neo
- 目标项目：E:\EaseCation\WebProject\easecation-design

GitHub 仓库使用 `easecation-design` 作为仓库名，README 标题和项目展示名称使用 `EaseCation Design`。

## 核心任务

1. 检查目标目录、参考项目、Git 状态、现有技术栈和远程仓库。
2. 深入分析 easecation-console-neo 中的全局样式、公共组件、页面结构、响应式规则、交互状态和品牌资产。
3. 将参考项目的颜色、字体、间距、圆角、边框、阴影、尺寸、断点、层级和动画整理为 Design Tokens。
4. 建立 ThemeProvider 或 ConfigProvider，通过 CSS Variables 和 TypeScript 类型提供主题配置能力。
5. 将 console-neo 的通用 UI 拆分成独立、可配置、可测试的 React 组件。
6. 删除业务 API、权限、登录、路由、业务 Store、固定文案和业务数据模型等耦合。
7. 支持 PC、平板、手机、横竖屏和高 DPI 屏幕。
8. 支持普通 Web、PWA、Android WebView、iOS WKWebView 和 Windows WebView2 等环境。
9. 对 Capacitor 提供可选 Adapter，不得强制普通 Web 项目安装 Capacitor。
10. 提供中文 README、接入教程、研发教程、组件教程和跨端教程。
11. 提供 Storybook、单元测试、类型检查、Lint、生产构建和 npm 包验证。
12. 建立适合公开 npm 包的 SemVer、变更记录、开源贡献和兼容性治理机制。
13. 从第一阶段同步建立 AI Native 的上下文、元数据、生成器、Storybook/MCP 和自动验证基础设施。
14. 集成用户指定的 GitHub Actions 发布脚本；如果脚本尚未提供，则建立兼容的 workflow_dispatch 手动发布工作流，并明确标记待替换或合并。

## 视觉原则

`E:\EaseCation\WebProject\easecation-console-neo` 是唯一视觉事实来源。

不要默认使用 ?????、Material Design、Bootstrap、Tailwind UI 或其他设计系统的默认视觉。????? 仅用于参考组件分类、API 一致性、类型设计、无障碍和工程组织。

不得直接复制第三方组件库源码和受版权保护的内容。

开发前重点分析：

- 品牌色、背景、文本和状态色；
- 字体、字号、字重和行高；
- 间距、圆角、边框和阴影；
- Header、Sidebar、Content 和卡片布局；
- Button、Input、Select、Table、Modal 等组件；
- hover、active、focus、selected、disabled、loading 和 error 状态；
- PC、平板和移动端断点；
- 动画、浮层、z-index 和滚动行为。

先输出简短分析和组件优先级，随后立即开发，不要停留在分析阶段。

## 开源与通用化要求

该组件库由 EaseCation 发起，但不是 EaseCation 内部专用包。公共设计必须满足：

- 可以由任意个人、团队或企业在不同业务领域使用。
- 公共组件名称、Props、事件和数据结构保持领域中立。
- 默认 EaseCation 主题与组件逻辑分离，允许完整替换颜色、字体、圆角、阴影、密度和动效。
- EaseCation Logo、商标、专属插画和可能受限的品牌资产不得因为代码开源而被默认授权；将其与通用包分离并补充商标说明。
- 检查从 console-neo 提取的源码、字体、图标、图片和依赖是否允许开源发布，无法确认权利的资产不得进入公开 npm 包。
- 建议采用 MIT 许可证；正式写入 LICENSE 前确认 EaseCation 对拟开源内容拥有授权。
- 提供 LICENSE、CONTRIBUTING.md、CODE_OF_CONDUCT.md、SECURITY.md、CHANGELOG 或 Changesets、Issue/PR 模板。
- 使用 SemVer，记录 Breaking Changes，为废弃 API 提供 deprecation 标记、迁移文档和合理过渡期。
- public npm scoped package 配置 `publishConfig.access=public`。
- README 明确说明设计来源、适用领域、许可证、商标边界和社区贡献方式。
- 至少提供一个不包含 EaseCation、游戏、服务器或玩家业务语义的示例应用，证明组件可用于其他领域。

开源不代表删除 EaseCation 署名。应保留设计来源说明，同时确保使用方能够在不使用 EaseCation 品牌资产的情况下独立采用和定制组件库。
## 技术要求

目标项目没有既有约束时，优先采用：

- React；
- TypeScript；
- Vite；
- pnpm；
- CSS Variables；
- CSS Modules 或结构明确的普通 CSS；
- Vitest；
- React Testing Library；
- Storybook；
- ESLint；
- Prettier；
- Changesets；
- GitHub Actions。

如果目标项目已有合理技术栈，应延续现有配置，不要无理由重新初始化。

组件库必须支持 ESM、TypeScript 类型、Tree Shaking、根入口、按需导入和样式正确加载。React 与 React DOM 应放入 peerDependencies，不得被打进组件库产物。

合理配置 package.json 的 exports、main、module、types、files、sideEffects、peerDependencies 和 publishConfig。

## Design Tokens

至少实现：

- color；
- typography；
- spacing；
- radius；
- shadow；
- border；
- size；
- breakpoint；
- z-index；
- motion；
- opacity；
- touch target；
- safe area。

Token 同时提供 CSS Variables 和 TypeScript 类型。禁止在组件内部散落大量魔法值。

## 组件范围

优先分析并实现以下组件：

基础组件：Button、IconButton、Typography、Link、Divider、Space、Flex、Grid、Container、Surface、Portal。

布局组件：Layout、Header、Sidebar、Content、Footer、PageContainer、PageHeader、ResponsiveGrid、SafeArea、BottomBar。

导航组件：Menu、Breadcrumb、Tabs、Pagination、Dropdown、MobileNavigation。

数据录入：Input、Textarea、InputNumber、Select、Checkbox、Radio、Switch、Slider、Search、Form、FormItem、Upload，以及参考项目中确实存在对应设计时的 DatePicker。

数据展示：Avatar、Badge、Tag、Card、Statistic、List、Table、Empty、Skeleton、Tooltip、Collapse、Descriptions。

反馈组件：Alert、Message、Notification、Modal、Drawer、ActionSheet、Popover、Popconfirm、Progress、Spin、Result、Toast。

根据 console-neo 的真实界面提取高价值复合组件，但对外应使用领域中立的名称和数据模型，例如 ProfilePanel、MetricCard、StatusCard、StatusBadge、ActionPanel 和 AppNavigation。EaseCation 品牌效果作为默认主题或示例呈现，公共组件不得硬编码业务数据、Logo、域名或特定行业模型。

不要为了数量创建空壳组件。优先交付视觉、交互、类型、测试和文档完整的核心组件。

## 组件质量

每个正式组件至少具备：

- 完整 TypeScript Props；
- 合理默认值；
- className 和 style；
- Ref 转发；
- 受控和非受控模式；
- 统一 size、variant、disabled、loading 和 status API；
- 键盘和 Focus Visible；
- 正确语义和 ARIA；
- PC 与移动端适配；
- 鼠标、触摸和 Pointer Events；
- 单元测试；
- Storybook 示例；
- 中文文档；
- 根入口和按需入口；
- 卸载时清理事件、定时器和 Observer。

## 响应式设计

支持宽屏桌面、普通桌面、平板、横屏手机和竖屏手机。

- Layout 和 Grid 支持响应式配置。
- Sidebar 在窄屏下折叠或变为 Drawer。
- Table 支持横向滚动、紧凑模式或卡片模式。
- Modal 在手机端支持全屏或接近全屏。
- Drawer 支持侧边与底部形态。
- Form 支持桌面横向和移动端纵向布局。
- Tabs、Pagination 和 Breadcrumb 在窄屏下不能严重溢出。
- 核心功能不能仅依赖 hover。
- 控件具备合理触摸区域。
- 支持横竖屏、字体缩放和动态视口高度。

## Capacitor 与跨端适配

组件库保持平台中立，Capacitor 能力通过可选 Adapter 接入。

必须处理：

1. Safe Area：支持 env(safe-area-inset-*)，让 Header、BottomBar、Modal、Drawer、ActionSheet 和 Toast 避开刘海、状态栏、导航栏和 Home Indicator。
2. 虚拟键盘：处理 visualViewport、输入框遮挡、底部操作栏、Modal 内聚焦、键盘收起和横竖屏变化。
3. Android 返回键：建立 Overlay Stack，提供 closeTopOverlay 和 onRequestClose，让宿主优先关闭最上层浮层。
4. 输入方式：支持鼠标、键盘、触摸、触控板、Pointer Events 和手写笔，不得全局禁用 touch-action 或文本选择。
5. 滚动：处理 iOS 惯性滚动、嵌套滚动、背景滚动锁定、滚动穿透和固定定位抖动。
6. Upload：兼容浏览器、Android WebView、iOS WKWebView 和 Windows WebView2；相机、权限和文件系统交给可选 Adapter。
7. 系统主题：允许宿主同步浅色/深色主题及原生状态栏，但组件库不得强制修改原生状态栏。
8. 性能：减少全局监听、重复渲染和同步布局，动画优先使用 transform 和 opacity，并支持按需加载。

不得在模块顶层无条件访问 window、document、navigator、localStorage、matchMedia、visualViewport、ResizeObserver 或 MutationObserver。保证 SSR 构建可以安全导入。

## AI Native 要求

从项目第一阶段就同步设计和实现 AI Native 工作流，不要等组件库开发完成后再补 AI 能力。

目标是让 Codex 等 AI Agent 可以可靠理解、检索、使用、生成和验证组件，同时不绕过人工审查与确定性质量门禁。

至少完成以下设计和基础实现：

1. 在根目录创建 `AGENTS.md`，写明架构、目录、命令、设计原则、代码规范、跨端规则、开源边界和禁止事项。
2. 建立 `docs/ai/`，至少包括架构说明、组件研发规范、设计语言说明和 AI 使用指南。
3. 建立机器可读组件注册表，描述组件名、导入路径、分类、成熟度、Props Schema、Design Tokens、平台支持、Stories、无障碍能力和废弃状态。
4. 为组件元数据提供 JSON Schema，并使用脚本校验注册表，避免元数据、文档和实现漂移。
5. 提供组件生成器，一次生成组件代码、类型、样式、测试、Story、文档和注册表条目。
6. 将 Storybook 作为组件示例和行为事实来源，并评估接入官方 Storybook MCP，使支持 MCP 的 AI Agent 能检索 Stories 与组件文档。
7. MCP 和 AI 工具只用于开发，不进入运行时产物，也不得接触 npm Token、私有环境变量或敏感信息。
8. 生成 `llms.txt` 作为项目、文档、组件和使用规范的精简索引；完整上下文如需提供，应由脚本生成，避免重复手工维护。
9. 建议提供 `generate:component`、`ai:context`、`ai:validate` 和 `registry:check` 等命令。
10. AI 工作流按照 Discover、Specify、Scaffold、Implement、Validate、Inspect、Review、Record 执行。
11. AI 生成的组件必须通过类型检查、Lint、单测、Storybook、可访问性、响应式、注册表和消费者导入验证。
12. AI 不得重复实现已有组件，不得引入 Console Neo 业务 API、私有地址或受限品牌资产，不得自行发布 npm 包。
13. AI 生成的 API 必须保持领域中立，并遵守 SemVer、废弃和迁移策略。
14. 至少实现第一阶段 AI Native 基础设施，不要只在文档中写未来规划；复杂 MCP 或智能生成能力可以分阶段实现，但需给出清晰架构和后续路线。

AI Native 的判断不能替代确定性测试和人工审核。视觉一致性、API 合理性、许可证、品牌边界和 Breaking Changes 必须由人工最终确认。
## 文档

根目录提供中文 README，至少包括：

- 项目介绍和设计来源；
- 主要特性和技术栈；
- 安装、全量引入和按需引入；
- 主题和响应式配置；
- 支持环境和 Capacitor 说明；
- 开发、测试、构建和 Storybook 命令；
- npm 发布方式；
- 适用领域与品牌主题定制；
- LICENSE、贡献指南、行为准则、安全政策和商标说明。

另外提供独立中文文档：

- 接入教程；
- 研发教程；
- 组件使用教程；
- Design Tokens 和主题教程；
- 响应式教程；
- Capacitor、Android、iOS 和 Windows WebView 教程；
- npm 发布教程；
- 非 EaseCation 项目的主题定制和迁移教程；
- 开源贡献、SemVer、兼容性和 API 废弃教程。

所有示例必须与真实 API 和命令一致，并至少提供一个不包含 EaseCation 业务语义的通用领域示例。

## 测试与验证

至少测试 ThemeProvider、Button、Input、Form、Tabs、Modal、Drawer、Toast、SafeArea、响应式 Hook、Overlay Stack、SSR 安全导入、键盘操作、Pointer Events 和资源清理。

完成后执行：

- 依赖安装；
- TypeScript 类型检查；
- ESLint；
- 单元测试；
- 生产构建；
- Storybook 构建；
- npm pack；
- npm 包内容检查；
- 最小消费者项目导入测试。

检查根入口、按需入口、类型声明、样式、Tree Shaking、peerDependencies、SSR、安全信息、业务耦合和移动端溢出。

如果没有 Android Studio、Xcode 或 Windows 原生工具链，只验证 Web 层和 WebView 兼容设计，并在最终报告中明确没有执行真实原生构建，不得声称已经在真实设备验证。

## GitHub 与 npm 发布

创建仓库前检查 EaseCation 组织下是否已有 `easecation-design`。如已存在，不要重复创建或覆盖。

若 GitHub CLI 已登录且当前账号有权限，可以创建仓库并设置描述；权限不足时继续本地开发，并提供人工操作命令。

GitHub Actions 使用 workflow_dispatch 手动发布公开 npm 包，读取 NPM_TOKEN Secret，依次执行安装、许可证检查、类型检查、Lint、测试、构建、npm 包检查和 npm publish，并支持 patch、minor、major、prerelease。若使用 scoped package，应配置 `publishConfig.access=public`。

优先使用用户指定的 GitHub Actions 脚本。如果指定脚本没有提供，建立兼容工作流并明确标注，不能声称已集成指定脚本。

未经明确授权，不要提交、推送或执行真实 npm publish。

## 执行顺序

第一阶段：检查目标项目和参考项目，分析 Git、技术栈、UI、Token、组件和业务耦合。

第二阶段：建立构建、主题、Token、测试、Storybook、npm 导出、响应式、Adapter，以及 AGENTS.md、AI 文档、组件注册表、Schema、生成器和 Storybook MCP 基础设施。

第三阶段：按照基础组件、布局组件、表单组件、展示组件、反馈组件、特色组件的顺序开发，每组同步完成测试、示例和文档。

第四阶段：执行类型检查、Lint、测试、构建、Storybook、npm pack、消费者导入和响应式验证。

第五阶段：完善中文文档、GitHub Actions 和最终报告。

## 验收标准

- 组件库可以正常构建和安装。
- 核心组件可实际使用，不是空壳。
- 视觉风格与 console-neo 一致。
- UI 与 EaseCation 业务逻辑、内部服务和特定行业模型解耦。
- 默认主题体现 Console Neo 的设计来源，同时可完整替换品牌 Token。
- 具有明确开源许可证、第三方许可清单、贡献规范、安全政策和商标边界。
- 至少有一个非 EaseCation、非游戏领域的消费者示例。
- 支持 PC、平板、手机和 WebView。
- 支持 Safe Area、虚拟键盘和 Android 返回键接入。
- Capacitor 是可选适配，不影响普通 Web 项目。
- 支持 SSR 安全导入。
- 类型、测试、Storybook 和中文文档完整。
- AI 可以通过 AGENTS.md、组件注册表、Schema、llms.txt 和 Storybook/MCP 正确发现并使用组件。
- AI 生成组件的流程具备脚手架、自动校验、人工审核和变更记录闭环。
- 具有 workflow_dispatch 手动 npm 发布流程。
- 凭据没有进入仓库。
- 最终报告真实列出通过、失败和未验证内容。

现在开始执行。首先检查：

E:\EaseCation\WebProject\easecation-design

E:\EaseCation\WebProject\easecation-console-neo

分析两个目录的项目结构、Git 状态、技术栈、公共组件、页面样式和设计系统，制定简短的多阶段计划，然后立即进入实际开发，不要只停留在分析阶段。
```

## 18. 预期最终交付物

- 可构建和发布的 React UI 组件库。
- 从 `easecation-console-neo` 提取的 EaseCation Design Tokens。
- 核心基础、布局、表单、展示和反馈组件。
- 领域中立的通用复合组件与可选 EaseCation 主题示例。
- PC、平板和移动端响应式能力。
- Capacitor/WebView 可选适配层。
- Storybook 组件站点。
- 中文 README 与独立教程。
- 单元测试和消费者导入测试。
- 手动 GitHub Actions npm 发布工作流。
- 真实记录测试结果和未验证事项的交付报告。
- `LICENSE`、`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md` 和 `SECURITY.md`。
- 第三方许可证及品牌资产审查记录。
- 至少一个非 EaseCation 业务领域的示例应用。
- SemVer、变更日志、废弃策略和迁移指南。
- AGENTS.md、docs/ai/、组件注册表、JSON Schema、组件生成器和 AI 校验命令。
- Storybook MCP 接入或经过验证的接入方案，以及自动生成的 llms.txt。



