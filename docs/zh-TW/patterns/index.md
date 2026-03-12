---
description: 根據你目前的 styling 問題或團隊採用階段，選擇應該先讀哪個 pattern 頁面。
---

# Patterns

Patterns 頁面涵蓋 PikaCSS 專案中可重複使用的應用架構與團隊實踐。每個頁面專注於一個反覆出現的問題，以及如何用 PikaCSS 的模型解決它。

## 先讀哪個？

用這份決策指南來選擇：

| 你的情況 | 先讀這個 |
| --- | --- |
| 正在建立一個可重用的單一 component | [Component Styling](/zh-TW/patterns/component-styling) |
| 需要加入 hover states、focus rings 或 responsive breakpoints | [Responsive And Selectors](/zh-TW/patterns/responsive-and-selectors) |
| 需要在 runtime 儲存每個實例的動態值 | [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables) |
| 正在建立擁有共享 tokens 的 design system | [Theming And Variables](/zh-TW/patterns/theming-and-variables) |

如果不確定，先從 [Component Styling](/zh-TW/patterns/component-styling) 開始。它建立了其他頁面所延伸的基礎模式。

## Pattern 頁面

- [Component Styling](/zh-TW/patterns/component-styling) — 用 base styles、variants 與 state layers 結構化一個 PikaCSS component。
- [Responsive And Selectors](/zh-TW/patterns/responsive-and-selectors) — 為 hover、focus、dark mode 與 breakpoints 套用 selector aliases。
- [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables) — 用 CSS custom properties 橋接靜態抽取與 runtime 可變值。
- [Theming And Variables](/zh-TW/patterns/theming-and-variables) — 建立設計 token 層並跨 components 套用。

## Next

- [Component Styling](/zh-TW/patterns/component-styling)
- [核心功能總覽](/zh-TW/guide/core-features-overview)
- [Configuration](/zh-TW/guide/configuration)
