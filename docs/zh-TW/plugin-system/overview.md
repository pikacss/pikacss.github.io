---
description: 了解 PikaCSS plugins 能擴充哪些能力、plugin hooks 如何配合，以及 plugin authoring 在文件路徑中的位置。
---

# Plugin System Overview

PikaCSS plugins 是 engine 的公開擴充機制。你可以在不 fork core 的情況下加入行為，無論是調整 config、註冊 selectors 和 shortcuts、輸出 preflights、擴充 autocomplete，或在 CSS 產生前轉換抽出的 style input。

## 這個章節適合誰

這個章節是給想要擴充 PikaCSS 本身，而不只是使用它的讀者。當你想做下面這些事時，再來讀它：

- 為某個產品或 design system 建立 custom plugin
- 理解官方 plugins 的結構
- 使用 lifecycle hooks，而不只是使用面向終端使用者的 config

## 前置閱讀

在撰寫 plugin 之前，你應該已經讀過並理解以下頁面：

- [靜態限制](/zh-TW/getting-started/static-arguments) — plugins 運作所在的靜態輸入模型是核心限制
- [Build-Time Engine](/zh-TW/concepts/build-time-engine) — engine 如何處理原始碼檔案
- [核心功能總覽](/zh-TW/guide/core-features-overview) — plugins 可以在其上建構的公開 engine capabilities
- [Configuration](/zh-TW/guide/configuration) — 三個 config buckets 以及 engine 接受的內容

跳過這些代表你很可能在公開 engine APIs 已經更簡單安全的情況下，去使用 transform hooks。

## 官方 plugin 參考矩陣

在開始新的 plugin 之前，用這張表選擇一個官方 plugin 作為參考實作：

| 使用情境 | 參考 plugin | 原因 |
| --- | --- | --- |
| 簡單的全域 resets 或 preflights | [Reset](/zh-TW/plugins/reset) | 展示最小化的 `configureEngine` preflights 用法 |
| Collection 解析與 build-time 展開 | [Icons](/zh-TW/plugins/icons) | 展示非同步 config 解析與 build-time 資產展開 |
| Provider 抽象與 CSS imports | [Fonts](/zh-TW/plugins/fonts) | 展示 `engine.appendCssImport()` 與 provider 切換 |
| 作用域 variables 與可組合的 shortcuts | [Typography](/zh-TW/plugins/typography) | 展示 variable scoping 與 shortcut recipes 的結合 |

如果你的 plugin 較小，從 Reset 開始。如果你的 plugin 結合了 variables 與 shortcuts，從 Typography 開始。

## 什麼是 engine plugin

Plugins 是用 `defineEnginePlugin()` 宣告的普通物件。

<<< @/zh-TW/.examples/plugin-system/overview-minimal-plugin.ts

公開介面刻意維持精簡。Plugin 只有名稱、可選的排序，以及可選的 hooks。

<<< @/zh-TW/.examples/plugin-system/overview-engine-plugin-interface.ts

## 用一句話理解 plugin lifecycle

Plugins 可以修改 raw config、對 resolved config 做出反應、在 engine 上註冊行為、轉換抽出的輸入，並觀察像 preflight 或 autocomplete 更新這類下游事件。

## Canonical lifecycle timeline

當你在判斷 plugin 應該在哪裡介入時，請把這張表當成高層時間線：

| 階段 | 在這裡已經穩定的是什麼 | 什麼情況下該選它 |
| --- | --- | --- |
| `configureRawConfig` | user config 已存在，但 defaults 尚未套用 | 你需要在 resolution 發生前補 defaults 或正規化 config |
| `configureResolvedConfig` | resolved config 已經定案，但 engine state 尚未建立 | 你需要先看到完整 config 圖像，才能決定要註冊什麼 |
| `configureEngine` | 公開 engine APIs 已可使用 | selectors、shortcuts、variables、keyframes、preflights、CSS imports 與 autocomplete 已經足夠 |
| transform hooks | 抽出的 payload 正在 plugins 之間流動 | 你必須直接改寫 selectors、style items 或 nested definitions |
| sync notification hooks | 下游 engine events 已經發生 | 你只需要 logging、bookkeeping 或副作用 |

如果超過一個階段都能解決問題，優先選更晚的那個。這通常能讓 plugin 更小，也更容易和其他 plugin 組合。

## 怎麼看待 hooks

- 當你需要在 defaults 穩定之前塑形 user config，請用 `configureRawConfig`
- 當你需要先看到最終 resolved 結果再動作，請用 `configureResolvedConfig`
- 當你想呼叫像 `engine.shortcuts.add()` 或 `engine.appendCssImport()` 這種公開 engine API，請用 `configureEngine`
- 只有在註冊 API 不夠用時，才使用 transform hooks
- 當你只需要觀察、記錄或做副作用時，請使用同步 notification hooks

Hook 的選擇很重要，因為越晚的 hook 越容易推理。大多數 plugins 在把介入點盡量往後延時，都會保持得更簡單。

## 排序規則

Plugins 會依序以 `pre`、預設、再到 `post` 的順序執行。

<<< @/zh-TW/.examples/plugin-system/overview-plugin-order.ts

這個排序只定義 user plugins 彼此之間的相對位置。它不會把你的 plugin 移到已經接好 engine pipeline 的 core internals 前面。

## Plugin authors 一開始就該知道的事

1. Core feature config 和外部 plugins 是兩個不同的擴充介面。
2. 公開 engine APIs 已經覆蓋了許多常見 plugin 需求，不一定要用 custom transforms。
3. Preflights 和 CSS imports 會影響全域輸出，因此應該額外節制。
4. 當 plugin 帶來新的 config 或 autocomplete 能力時，型別擴充本身就是 plugin design 的一部分。

## 建議學習路徑

先從 [Create A Plugin](/zh-TW/plugin-system/create-plugin) 開始，再繼續讀 [Hook Execution](/zh-TW/plugin-system/hook-execution)。之後再把官方 plugins 當成實際的封裝與 API 設計參考實作來看。

閱讀官方 plugin 頁面時，請一次只帶著一個狹窄問題去看。Reset 最適合看 additive preflight，Icons 最適合看 async expansion，Fonts 最適合看 CSS imports，Typography 最適合看 variables 加 shortcuts 的組合。

## Next

- [建立 Plugin](/zh-TW/plugin-system/create-plugin)
- [Hook 執行順序](/zh-TW/plugin-system/hook-execution)
- [核心功能總覽](/zh-TW/guide/core-features-overview)
