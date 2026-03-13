---
description: 了解如何設計職責單純的 PikaCSS plugin、選對第一個 hook，並提供對終端使用者來說像內建功能的型別體驗。
---

# Create A Plugin

好的 PikaCSS plugin 通常都從小處開始。最好的第一個 plugin，是把某個重複問題清楚地解掉，而不是試圖在一個 package 裡重做半個 engine。職責狹窄的 plugin 更容易解釋、更容易和其他 plugins 組合，也更容易在真實專案依賴它之後繼續 debug。

## 最小 plugin factory

<<< @/zh-TW/.examples/plugin-system/minimal-plugin.ts

如果 plugin 需要 options，請匯出 factory，而不是 singleton object。這會讓每個 instance 的選項更明確，也讓 config 更容易審查。

<<< @/zh-TW/.examples/plugin-system/plugin-with-options.ts

## 第一個 plugin 最有用的 hook

大多數第一個 plugin 都應該從 `configureEngine` 開始。

<<< @/zh-TW/.examples/plugin-system/hook-configure-engine.ts

`configureEngine` 讓你接觸 selectors、shortcuts、variables、keyframes、preflights、CSS imports 與 autocomplete 的穩定公開 API。對很大一部分 plugin 想法來說，這已經夠用了。

把 `engine.appendAutocomplete()` 當成唯一的 autocomplete 貢獻入口。它可以用一個 payload 同時註冊 selectors、style item strings、額外 properties、CSS property values，以及 pattern-based completions。

<<< @/zh-TW/.examples/plugin-system/autocomplete-api.ts

## 什麼時候該用其他 hooks

只有在 `configureEngine` 已經不夠用時，才往更早或更深的 hooks 走。

- 使用 `configureRawConfig` 在 resolution 前插入預設值，或塑形使用者輸入
- 使用 `configureResolvedConfig` 在 config 正規化完成後做出反應
- 只有在你必須直接改寫抽出的 selectors、style items 或 style definitions 時，才使用 transform hooks

<<< @/zh-TW/.examples/plugin-system/hook-configure-raw-config.ts

<<< @/zh-TW/.examples/plugin-system/hook-configure-resolved-config.ts

## 同一個問題，不同的 hook 選擇

在你伸手去拿 transform hook 之前，先用這個快速對照：

| 如果 plugin 想解的是... | 優先選擇 | 原因 |
| --- | --- | --- |
| 加入新的 selectors、shortcuts、variables、keyframes、preflights、imports 或 autocomplete | `configureEngine` | 公開 engine API 已經能直接表達這個改動 |
| 在 config resolution 前插入 plugin defaults | `configureRawConfig` | plugin 可以先塑形使用者輸入 |
| 在不改寫 payload 的前提下，根據最終 resolved config 做反應 | `configureResolvedConfig` | 你可以看到完整正規化後的圖像，而不需要動到抽出的樣式資料 |
| 直接改寫抽出的 selectors、style items 或 nested definitions | transform hooks | 只有在 additive registration 無法表達工作內容時才需要 |

如果兩個 hooks 看起來都能做，先選更晚的那個，只有在出現具體限制時才往前或往更深的 hooks 移動。

## 為終端使用者補上型別（進階——只有當你的 plugin 新增 config keys 時才需要）

大多數 plugins 不需要 module augmentation。如果 plugin 只呼叫 `engine.appendSelectors()`、`engine.appendVariables()` 或 `engine.addPreflight()` 這類公開 engine APIs，TypeScript 本身已經知道發生了什麼事。只有當你的 plugin **引入新的頂層 config keys**，且終端使用者會把這些 keys 放進 `pika.config.ts` 時，才需要 module augmentation。

::: tip 如果你的 plugin 不擴充 config schema，請跳過此節
如果你的 plugin 是使用公開 engine API 來登記 shortcuts、selectors 或 variables，就停在這裡。你不需要擴充任何型別。
:::

如果你的 plugin 確實新增了新的 config keys，請擴充 engine 的 config interface，讓這些 keys 出現在 autocomplete 和型別檢查中，而不需要使用者自行 cast：

<<< @/zh-TW/.examples/plugin-system/module-augmentation.ts

<<< @/zh-TW/.examples/plugin-system/use-plugin-in-config.ts

## Preflights 既強大又是全域性的

Preflights 適合用來處理全域 defaults、resets、tokens，或產生出的結構性 CSS。它們不適合承載任意 component styling，因為它們會影響整體輸出。

::: warning 不要用 preflights 放 component 層級或頁面專屬的 styles
Preflights 在所有 component styles 之前執行，且無法條件式套用。把 component 專屬規則放進 preflight 會讓這些規則全域套用到每一頁，造成應用程式其他地方意料之外的視覺回歸。

適合放進 preflights 的內容：CSS resets、`:root` token 宣告、基礎排版預設、結構性佈局基礎。

不適合的內容：button styles、card 佈局、modal overlays、頁面專屬規則。

<<< @/zh-TW/.examples/plugin-system/preflight-bad-example.ts
:::

像託管字體樣式表這種 top-level `@import` 規則，請使用 `engine.appendCssImport()`。這些 imports 必須停留在產生 CSS 的頂端，因此不該表達成一般 preflights。

如果 plugin 會匯出可重用的 preflight payload，或由 helper 回傳 preflight objects，請使用 `definePreflight()`。它就是 preflight 版本的 `defineStyleDefinition()`：runtime 行為完全不變，但共享 plugin 程式碼可以維持正確的公開型別形狀。

<<< @/zh-TW/.examples/plugin-system/css-import-api.ts

<<< @/zh-TW/.examples/plugin-system/preflight-definition.ts

<<< @/zh-TW/.examples/plugin-system/preflight-with-layer.ts

<<< @/zh-TW/.examples/plugin-system/preflight-with-id.ts

如果 plugin 需要 hover states、dark mode contexts，或其他可重用條件，優先透過 engine config 或公開 engine APIs 註冊 selectors，而不是教使用者輸出原始 pseudo-selector nesting。這樣 plugin 才能和 [Selectors](/zh-TW/guide/core-features/selectors) 文件裡的 flat atomic 路徑保持一致。

## 一份實用的第一個 plugin 檢查清單

1. 給 plugin 一個清楚且單一的責任。
2. 除非有真正的限制證明你需要別的 hook，否則先從 `configureEngine` 開始。
3. 當 plugin 會改變 config 或 autocomplete 時，一起交付型別。
4. 把 preflights 和 imports 視為全域輸出決策。
5. 發布前先拿官方 plugin 的設計做對照。

## 參考實作

官方的 reset、fonts、icons 與 typography plugins 展現了不同複雜度層級。請把它們當成實作參考，不要把它們理解成每個 plugin 都應該做得一樣廣。

- [Reset](/zh-TW/plugins/reset) 是 preflights 與全域 defaults 的最小 additive 參考。
- [Icons](/zh-TW/plugins/icons) 最適合拿來參考 plugin 如何非同步解析 assets 或展開 source strings。
- [Fonts](/zh-TW/plugins/fonts) 最適合拿來參考 CSS imports 與 provider 切換。
- [Typography](/zh-TW/plugins/typography) 最適合拿來參考 variables 與 shortcuts 如何組成單一使用者 API。

## Next

- [Hook 執行順序](/zh-TW/plugin-system/hook-execution)
- [Plugin 系統總覽](/zh-TW/plugin-system/overview)
- [Icons](/zh-TW/plugins/icons)
- [Reset](/zh-TW/plugins/reset)
