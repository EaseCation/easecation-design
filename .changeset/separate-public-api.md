---
'@easecation/design': minor
---

Separate the formal component API from the Ant Design compatibility layer. Import legacy compatibility symbols from `@easecation/design/compat/antd`, and use the dedicated `@easecation/design/tokens` entry for the typed token contract. Fix system-theme hydration, externalize runtime dependencies, and stop bundling fonts in the public stylesheet.
