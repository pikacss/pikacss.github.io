---
description: 了解讓 PikaCSS 成立的靜態輸入規則，並把它當成正式導入前最主要的採用篩選條件。
---

# 靜態限制

這一頁說明的是決定 PikaCSS 是否適合你專案的那條規則。

`pika()` 會在 build 時從原始碼直接被分析。這代表 integration 必須在不執行應用程式的前提下，就能理解 argument 的形狀。如果 style 輸入依賴 runtime state，PikaCSS 就無法可靠地轉換它。

## 採用前的決策樹

在設定專案之前，先用這份檢查清單確認：

| 問題 | 如果是 | 如果否 |
| --- | --- | --- |
| 大部分的 styles 能用字面值 objects、strings 或靜態組合的值來表達嗎？ | 繼續前往安裝 | 停在這裡——PikaCSS 不是正確的工具 |
| 主題值可以移進 CSS variables，而不是在 runtime 計算嗎？ | 繼續 | 評估動態主題化是否比靜態輸出更重要 |
| 狀態差異可以用具名 selector aliases 來表達，而不是內嵌邏輯嗎？ | 繼續 | 考慮使用 runtime CSS-in-JS 方案 |
| 團隊能在大規模採用前，把 ESLint integration 加進 CI 嗎？ | 你已準備好採用 | 在 rollout 前先解決規則強制的問題 |

如果第一個問題對 codebase 的大部分來說答案是否定的，就在花費設定時間之前先排除 PikaCSS。

## 把靜態輸入當成產品邊界

不要把靜態限制當成之後再想辦法補洞的麻煩。這條邊界正是 engine 之所以有價值的前提。

如果團隊能把 style 輸入維持在可靜態分析的範圍內，PikaCSS 就能預先產生 CSS、型別與可預測的輸出。如果 design system 依賴從 runtime 資料動態計算 style objects，那這個模型就不適合你的專案。

## extractor 看得懂什麼

字面值 objects、arrays、strings、巢狀的靜態結構，以及穩定的 composition，都是最理想的用法。

<<< @/zh-TW/.examples/community/faq-static-ok.ts

## 什麼會破壞 build-time 模型

runtime function calls、mutable state、computed member access，或任何放進 `pika()` 裡的任意 expressions，都會破壞 build-time 模型。

<<< @/zh-TW/.examples/community/faq-static-bad.ts

<<< @/zh-TW/.examples/integrations/eslint-invalid-example.ts

## 為什麼這個限制值得保留

PikaCSS 的價值正是來自這條邊界：

- 它能把原始碼轉成 deterministic atomic CSS。
- 它能在事先知道 style 內容的前提下去重 declarations。
- 它能產生 autocomplete 型別與 plugin 定義的 tokens。
- 它讓 runtime bundle 不需要負擔 styling 工作。

如果 engine 接受任意 runtime values，這些保證就會一起失效。

## 用什麼取代 runtime style generation

當你覺得自己需要 runtime style logic 時，請先從下面這些模式選：

1. 先宣告 variants，再在 runtime 切換 class names。
2. 把重複組合移進 shortcuts。
3. 把主題值或每個實例的動態值移進 CSS variables。
4. 把狀態差異移進 `hover`、`focus` 這類 selectors，或自訂 aliases。
5. 在 runtime 計算要使用哪個靜態 style block，而不是計算 style block 的內容。

::: tip 一個好用的思考模型
在 runtime 選擇靜態 style definitions，不要在 runtime 動態計算 style definitions。
:::

如果真正會變的是 value 本身，接著請看 [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)。

## 在 rollout 前先把規則強制起來

請加入 ESLint integration，讓錯誤在編輯器和 CI 裡就被攔下來，而不是等到檢查 build 輸出時才發現。

<<< @/zh-TW/.examples/integrations/eslint-valid-example.ts

## 實務上的該做與不該做

| 該做 | 不該做 |
| --- | --- |
| 預先宣告 `primary`、`secondary`、`danger` 這類 style variants。 | 在 `pika()` 裡根據 API 資料動態組出 style object。 |
| 用 CSS variables 表達主題值。 | 直接在呼叫裡讀取 runtime theme object。 |
| 用 selectors 與 shortcuts 編碼重複出現的模式。 | 在每個 component 裡各自用臨時計算的 object 重寫同一套邏輯。 |

## Next

- [PikaCSS 是什麼？](/zh-TW/getting-started/what-is-pikacss)
- [安裝](/zh-TW/getting-started/installation)
- [ESLint](/zh-TW/integrations/eslint)
- [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)
