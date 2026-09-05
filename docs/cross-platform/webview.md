# Capacitor、Android、iOS 与 Windows WebView

1. 在 viewport meta 中启用 `viewport-fit=cover`。
2. 使用 `SafeArea` 或 `--ec-safe-*` 处理状态栏与 Home Indicator。
3. 宿主监听 Android back button 后先调用 `closeTopOverlay()`；返回 false 时再处理路由或退出。
4. 使用 `observeKeyboardViewport()` 同步键盘高度，不在模块顶层读取 `visualViewport`。
5. Upload 的相机、文件权限和原生文件系统交给可选 `PlatformAdapter`。

当前仓库只验证 Web 层设计；未声称完成 Android Studio、Xcode 或 WebView2 真实设备构建。
