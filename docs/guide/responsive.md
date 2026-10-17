# 响应式教程

断点为 phone 480、tablet 768、desktop 1024、wide 1440。布局优先使用容器查询友好的 CSS Grid 和 `ResponsiveGrid`。移动端核心控件至少使用 `--ec-touch-target`，Modal 自动接近全屏，Drawer 支持 bottom placement，Tabs 可横向滚动。

`ResponsiveGrid.mobileColumns` fixes the column count below 768px. Omit it for automatic fitting. Use it for compact metrics and filters instead of consumer `!important` overrides; `minColumnWidth` still controls automatic fitting at larger widths.
