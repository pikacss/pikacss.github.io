---
description: 把 animation names 與 frame definitions 註冊一次，讓 keyframes 成為可重用且有型別的 engine data，而不是散落的 CSS 片段。
---

# Keyframes

`keyframes` 會在 engine config 中註冊 animation names 與可選的 frame definitions，讓它們可以參與 autocomplete 與 generated CSS output。

這能把 animation 命名集中起來。專案不必在 component 間反覆複製原始 `@keyframes` 邏輯，而是擁有一套共享的 animation vocabulary。

## 在 config 中註冊 keyframes

<<< @/zh-TW/.examples/guide/config-keyframes.ts

這個 config 支援只有名稱的項目、tuple form、object form、autocomplete hints 與 pruning control。

## 在 style definitions 中使用它們

<<< @/zh-TW/.examples/guide/keyframes.pikainput.ts

<<< @/zh-TW/.examples/guide/keyframes.pikaoutput.css

## 為什麼這屬於 core features

Keyframes 會和 selectors、shortcuts、variables 一樣，直接影響 CSS 輸出與 autocomplete。

它們不只是便利包裝，而是讓程式碼庫能標準化 motion tokens，並對 animation 用法保有清楚的 review surface。

## 一條實用規則

先把 animation names 註冊一次，之後在所有地方重用這些名稱。

如果 animation strings 在 component 間各自複製，團隊就會失去 pruning、autocomplete，以及集中檢視 motion 慣例的能力。

## Next

- [Core Features Overview](/zh-TW/guide/core-features-overview)
- [Shortcuts](/zh-TW/guide/core-features/shortcuts)
- [Configuration](/zh-TW/guide/configuration)
- [Component Styling](/zh-TW/patterns/component-styling)
