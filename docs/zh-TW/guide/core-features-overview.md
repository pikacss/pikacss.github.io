---
description: 了解哪些能力屬於 PikaCSS engine 本身，以及每個核心功能在採用路徑中的定位。
---

# Core Features Overview

PikaCSS 內建了一組不需要額外安裝套件就能使用的 engine capabilities。它們是透過頂層 engine config keys 設定的，因為這些能力會直接塑造預設的樣式模型。

較舊的實作細節可能會把它們稱為 built-in plugins，但對使用者來說區分更簡單：這些是 core features，不是可安裝的生態系 modules。

## 什麼情況算是 core feature

只要某個能力會改變 engine 如何理解樣式輸入、如何輸出 CSS，或如何在不安裝額外套件的情況下暴露 autocomplete，它就屬於 core feature。

這也是為什麼這些功能直接放在 engine config，而不是 external `plugins` array。

## 核心功能集合

| 核心功能 | 用途 | 它改變的是什麼 |
| --- | --- | --- |
| important | 全域與每個 definition 的 `!important` 行為 | generated CSS 中 declarations 的優先權 |
| variables | CSS custom properties、token scope、autocomplete | 可用 tokens 與 property value suggestions |
| keyframes | animation 註冊與 autocomplete | 可重用的 animation names 與輸出的 `@keyframes` |
| selectors | pseudo states、media aliases、自訂 selector 展開 | 類 selector 輸入如何展開成 CSS |
| shortcuts | 可重用的樣式 recipe 與動態 shortcut patterns | 重複的靜態樣式模式如何被撰寫與重用 |

<<< @/zh-TW/.examples/guide/core-features-config.ts

## 章節地圖

大多數團隊應該先從 [Selectors](/zh-TW/guide/core-features/selectors) 和 [Variables](/zh-TW/guide/core-features/variables) 開始，因為這兩個功能直接塑造了團隊表達 breakpoints、states 與設計 tokens 的方式。當各 components 之間出現明顯重複的 style patterns 時，再加入 [Shortcuts](/zh-TW/guide/core-features/shortcuts)。只有在團隊對動畫有具體需求或需要優先權覆寫時，才引入 [Keyframes](/zh-TW/guide/core-features/keyframes) 和 [Important](/zh-TW/guide/core-features/important)。

- [Selectors](/zh-TW/guide/core-features/selectors) 說明可重用的狀態、context 與 media aliases。**從這裡開始。**
- [Variables](/zh-TW/guide/core-features/variables) 說明 tokens、scope 與 runtime-safe 的值變化。**第二個閱讀。**
- [Shortcuts](/zh-TW/guide/core-features/shortcuts) 說明具名的靜態 recipes 與動態 shortcut patterns。
- [Keyframes](/zh-TW/guide/core-features/keyframes) 說明 animation 註冊、autocomplete 與輸出。
- [Important](/zh-TW/guide/core-features/important) 說明全域預設與每個 definition 的覆寫。

## core features 不是什麼

Core features 不是可安裝的套件。

Core features 不是在 external `plugins` array 裡設定的。

Core features 也不是讓你把 runtime styling 重新塞回 `pika()` 的藉口。

如果你要的是 icons、reset、typography 或 fonts，你找的是 external plugins。如果你要的是 selectors、shortcuts、variables、keyframes 或 `important`，你設定的是 engine 本身。

## 為什麼這個區分重要

第一次接觸的人常會以為所有 extension points 都應該放進 `plugins`。這種假設對生態系模組成立，但對 engine 行為就不成立。

如果 config key 是 `variables`、`selectors`、`shortcuts`、`keyframes` 或 `important`，就把它留在頂層。如果它是 `@pikacss/plugin-icons` 這類可安裝模組，就放進 `plugins`。

## 團隊通常怎麼採用這些功能

多數團隊會先從 `selectors` 與 `variables` 開始，因為它們會直接影響 breakpoints、states 與主題 tokens。

當重複模式開始明顯時，下一步通常會加入 `shortcuts`。

`keyframes` 與 `important` 通常會更有意識地引入，因為它們解決的問題比較窄，也更需要團隊規則。

## 可以往哪裡看更深入

- component 架構中的 selectors 用法在 [Responsive And Selectors](/zh-TW/patterns/responsive-and-selectors)
- 主題流程中的 variables 用法在 [Theming And Variables](/zh-TW/patterns/theming-and-variables)
- runtime 友善的值變化方式在 [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)
- engine 層級設定在 [Configuration](/zh-TW/guide/configuration)
- extension APIs 在 [Plugin System Overview](/zh-TW/plugin-system/overview)

## Next

- [Configuration](/zh-TW/guide/configuration)
- [Important](/zh-TW/guide/core-features/important)
- [Variables](/zh-TW/guide/core-features/variables)
- [Selectors](/zh-TW/guide/core-features/selectors)
