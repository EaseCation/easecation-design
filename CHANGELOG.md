# Changelog

## 0.13.2

### Patch Changes

- Allow DateRangePicker consumers to explicitly apply open-ended ranges.

## 0.13.1

### Patch Changes

- Keep the date range popover at its responsive width instead of inheriting the narrower generic popover width.

## 0.13.0

### Minor Changes

- Add a responsive DateRangePicker with date and precise datetime modes, presets, validation, and controlled apply behavior. Align DateTimePicker sizing with other filter controls.

## 0.12.0

### Minor Changes

- Add portal-based Select menus with label association and grouped options, reusable class-name utilities, separate Input shell and native input styling, standardized filter control sizing, semantic Button tones and inline actions, configurable responsive dialog sizing, nesting and dismissal controls, composable Tabs and Table primitives, compact actionable StatCard variants with semantic tones, and Checkbox checked-state interoperability.

## 0.11.4

### Patch Changes

- Keep DateTimePicker trigger focus on coarse pointers to prevent mobile WebKit viewport jumps.

## 0.11.3

### Patch Changes

- Prevent DateTimePicker from scrolling the page when its date field receives initial focus.

## 0.11.2

### Patch Changes

- Add a complete disabled state to DateTimePicker for consistent use in forms and filter bars.

## 0.11.1

### Patch Changes

- Keep sticky QueryDataTable columns on the table surface in light and dark themes, without translucent backdrop artifacts.

## 0.11.0

### Minor Changes

- Add a 48px `xl` Button size for prominent page-level primary actions.

## 0.10.2

### Patch Changes

- Use an opaque application header surface so scrolled content remains legible in sticky mobile layouts.

## 0.10.1

### Patch Changes

- Keep icon and label children as direct flex items so compact buttons do not wrap icons above text.

## 0.10.0

### Minor Changes

- Add composable link buttons and stable extra-small and icon-only button sizes for dense application toolbars.

## 0.9.1

### Patch Changes

- Add the existing 2xl radius token to Skeleton radius variants.

## 0.9.0

### Minor Changes

- Add token-based Skeleton radius variants and an embedded EmptyState surface for consistent loading and empty states inside existing containers.

## 0.8.0

### Minor Changes

- 8ba85a5: Add FileButton and BadgeButton, and let Combobox preserve continuously edited custom values for fields that combine presets with arbitrary identifiers.

## 0.7.0

### Minor Changes

- a118bc0: Add an accessible, responsive TreeView with controlled selection and expansion, roving focus, standard keyboard navigation, disabled states, SSR coverage, and touch-friendly targets.

## 0.6.0

### Minor Changes

- f058b20: Add ActionCard for accessible, responsive content-rich actions and selectable surfaces.

## 0.5.0

### Minor Changes

- 527bfb2: Add typed Alert, SegmentedControl, and DescriptionList components with responsive and accessible behavior.
- 527bfb2: Add the typed StatusBadge component for consistent semantic status presentation.
- 9ec6cae: Separate the formal component API from the Ant Design compatibility layer. Import legacy compatibility symbols from `@easecation/design/compat/antd`, and use the dedicated `@easecation/design/tokens` entry for the typed token contract. Fix system-theme hydration, externalize runtime dependencies, and stop bundling fonts in the public stylesheet.
- 527bfb2: Add ESLint presets that prevent raw UI controls, component appearance overrides, and new compatibility imports.

本项目遵循 Semantic Versioning。所有重要变更都会记录在此文件中。

## 0.4.0 - 2026-09-04

- 强化 Modal、Drawer 与 ResponsiveOverlay 的移动端布局，支持 Visual Viewport、软键盘、Safe Area、长内容滚动和真正的移动端全屏 Modal。
- 为无标题 Modal 与 Drawer 增加 `ariaLabel`，并为 Drawer 增加 `style`，保留既有公开 API 与兼容层调用方式。
- 统一浮层层级和暗色主题继承，提升触控设备上的点击目标、筛选栏、操作栏、日期时间与表单底栏布局。
- 为 Navbar 与 ResponsiveOverlay 补充正式 Storybook 场景，并增加移动端浮层回归测试。

## 0.1.0 - 2026-07-29

- 建立完整的 Design Tokens、主题、密度和 CSS Variables 系统。
- 提供基础、布局、导航、数据录入、数据展示、反馈与复合模式组件。
- 提供 Light、Dark、System 和 Black Gold 主题。
- 建立 Storybook、单元测试、视觉回归、组件注册表和 AI Native 工具链。
- 提供 SSR、Safe Area、虚拟键盘、Overlay Stack 和可选平台 Adapter。
- 提供 ESM、TypeScript 类型、Tree Shaking、npm 包检查与通用消费者示例。
