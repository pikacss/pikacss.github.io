---
description: 了解 PikaCSS 真正提供的是什麼、它的 build-time 模型適合哪些場景，以及它刻意不處理哪些需求。
---

# PikaCSS 是什麼？

PikaCSS 是一個 build-time atomic CSS-in-JS engine。你在 JavaScript 或 TypeScript 中撰寫 style definitions，integration 會在支援的原始碼檔案裡掃描 `pika()` 呼叫，並在 build 時把這些呼叫改寫成 class names 加上 generated CSS。

真正有用的區別，不是它的 API 看起來像 CSS-in-JS。真正有用的區別是，style 輸入被當成 build 輸入，而不是 runtime logic。

這讓 PikaCSS 特別適合這類團隊：

- 想要 CSS-in-JS 的撰寫方式，但不承擔 runtime styling 成本。
- 想要 style definitions 與 engine 擴充能力的 TypeScript autocomplete。
- 想在同一套撰寫模型裡使用 selectors、shortcuts、variables 與 keyframes。
- 想要可以實際檢查，而不是只能猜測的 generated 輸出。

如果你的 design system 依賴從任意 runtime expressions 動態組出 style objects，那它就不適合你。PikaCSS 之所以有明確立場，就是因為 engine 只有在 build 時能理解 styling 輸入時才成立。

::: tip PikaCSS 最能發揮價值的情境
當 styles 能從原始碼結構直接得知時，PikaCSS 最有優勢，例如 component variants、responsive rules、theme selectors、design tokens 與可重用的 shortcuts。
:::

## 你實際上在寫的是什麼

你依然是在原始碼裡撰寫 style objects、巢狀 selectors 與 composition。差別在於，瀏覽器不會收到這整套 object model 當成 styling engine。PikaCSS 會在 build 期間抽出它能理解的內容、輸出 atomic CSS，最後在 runtime 只留下 class-name 結果。

<<< @/zh-TW/.examples/getting-started/pika-basic.pikainput.ts

## 為什麼團隊會選它

團隊通常是基於以下四個理由採用 PikaCSS：

1. 他們想要沒有用戶端 style engine 的 styling 輸出。
2. 他們仍然想在 TypeScript 中撰寫 styles 並保有 autocomplete。
3. 他們想透過 selectors、shortcuts、variables 與 plugins 擴充 engine，而不是為了所有需求都去發明 utility vocabulary。
4. 他們想讓重疊的 atomic declarations 保留局部 author intent，而不是依賴偶然的 stylesheet 順序。

第四點是 PikaCSS 真正重要的差異之一。它不會為了最大化 utility 重用，而犧牲局部 cascade 行為的正確性。

## 它刻意停下來的地方

PikaCSS 之所以成立，是因為 `pika()` 代表的是 build 輸入。integration 必須只靠原始碼本身，就能理解 argument 的形狀。

這代表採用前真正該問的問題，不是這個語法看起來是否方便，而是你的團隊能不能把大部分 styling 表達成可靜態分析的輸入。

如果答案是可以，PikaCSS 會給你靜態 CSS 輸出、generated files、autocomplete，以及更可預測的 atomic cascade 行為。如果答案是不行，這些限制其實是在提醒你這個模型不適合。

## 它和其他 styling 工具有什麼不同

多數 CSS-in-JS 工具優先追求 runtime 彈性，多數 utility-first 工具優先追求預先定義的 utility vocabulary。PikaCSS 位在不同的位置：

- 你依然直接撰寫 style objects。
- 正式環境交付的是 generated CSS，不是 runtime style injection。
- engine 透過 hooks 保持可擴充，而不是強迫所有 workflow 都套進 utility 命名慣例。

## 核心功能和 external plugins 解決的是不同工作

這份文件把 selectors、shortcuts、variables、keyframes 與 `important` 稱為核心功能。它們是透過頂層 config keys 設定的 engine 能力。

icons、reset、typography 與 fonts 這類 external plugins，則屬於放在 `plugins` array 裡的額外套件。

這個區分很重要，因為它會告訴團隊現在是在設定 engine 本身，還是在額外安裝一個 package。

## PikaCSS 不適合的情況

PikaCSS 有一條嚴格的靜態邊界。下列情況是不適配的場景，強行繼續下去只會帶來阻力，不只是不方便：

- **從 runtime 資料計算出的 styles** — 如果顏色、尺寸或佈局值來自 API 回應、使用者設定檔或 runtime 計算，PikaCSS 無法在 build time 抽取它們。
- **沒有 build step 的專案** — PikaCSS 需要 bundler integration。只用 CDN 或 script tag 的專案沒有抽取 pipeline。
- **已深度採用 Tailwind 且沒有遷移預算的團隊** — 從 Tailwind 切換代表要把 utility class names 換成 `pika()` 呼叫和 engine config。沒有時間做遷移的團隊，應該在未來的週期再評估 PikaCSS。
- **需要廣泛支援 IE 的專案** — PikaCSS 輸出的是現代 CSS，包括 custom properties，這些在舊版瀏覽器上沒有乾淨的 polyfill。
- **規模化後需要任意 CSS 表達能力的團隊** — 如果 design system 刻意混用 runtime 計算的 styles 和靜態的 styles，靜態 extractor 會成為瓶頸，而不是助力。

當這些條件中有任何一項適用於大部分的 codebase，就停止評估 PikaCSS，改為採用符合實際限制的工具。

## 先評估模型，再評估語法

PikaCSS 不保證任何合法的 JavaScript expression 都能成為 style 輸入。如果 engine 不能預先分析某個 expression，它就無法安全地轉換它。

::: warning 不要用 runtime API 的角度評估 PikaCSS
如果你是透過 dynamic function calls、mutable state、依賴 runtime 資料的 ternaries，或 `pika()` 裡的 computed member access 來測試 PikaCSS，那你其實是在測試錯的模型。
:::

## 哪些人應該繼續往下讀

- 正在評估取捨的團隊，應該在這頁之後立刻閱讀 [靜態限制](/zh-TW/getting-started/static-arguments)。
- 新採用的團隊，如果覺得這些限制可以接受，接著就該看 [安裝](/zh-TW/getting-started/installation)。
- Plugin authors 可以直接跳到 [Plugin System Overview](/zh-TW/plugin-system/overview)。

## Next

- [靜態限制](/zh-TW/getting-started/static-arguments)
- [安裝](/zh-TW/getting-started/installation)
- [PikaCSS 如何運作](/zh-TW/concepts/how-pikacss-works)
- [核心功能總覽](/zh-TW/guide/core-features-overview)
