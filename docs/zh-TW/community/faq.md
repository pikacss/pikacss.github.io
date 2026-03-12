---
description: 快速回答關於 build-time 行為、atomic 輸出、generated files，以及 PikaCSS 適用情境的常見問題。
---

# FAQ

## `pika()` 是 runtime function 嗎？

不是。`pika()` 是 build-time 輸入。engine 會掃描這個呼叫、抽出它能靜態理解的樣式資料，並在應用程式執行前先產生 CSS。

## 為什麼靜態限制這麼重要？

靜態輸入是 deterministic CSS generation、去重，以及 generated autocomplete 能成立的基礎。如果 build 沒辦法從原始碼讀出 styling 意圖，engine 就無法安全地產生你預期的輸出。

請參考 [Static Constraints](/zh-TW/getting-started/static-arguments)。

## 要怎麼最快判斷 PikaCSS 適不適合我的專案？

先問自己：專案裡大多數 styling，能不能用靜態原始碼輸入來表達？如果答案是否，那就是結構性的不匹配，不是幾個 helper utilities 可以遮掉的問題。

## PikaCSS 只是另一個 utility CSS framework 嗎？

不是。輸出雖然是 atomic CSS，但 authoring model 是由 style definitions 驅動。你可以撰寫 style objects、selectors、variables、shortcuts 和 plugins，而不是只能從固定的 utility 字典裡挑選。

<<< @/zh-TW/.examples/community/faq-atomic-input.ts

<<< @/zh-TW/.examples/community/faq-atomic-output.css

## Class token 順序會決定最終結果嗎？

不會只靠它自己決定。對 atomic CSS 來說，當宣告的 specificity 相同，結果仍然由 stylesheet 的順序決定。PikaCSS 會追蹤重疊的 property effects，讓後出現而且彼此重疊的 declarations 在順序真的影響 cascade 時，仍然保有局部意義。

請參考 [Atomic Order And Cascade](/zh-TW/concepts/atomic-order-and-cascade)。

## 我可以使用巢狀 selectors 嗎？

可以。巢狀 selectors 是正常 style-definition model 的一部分，不是另外開的一條逃生路徑。

<<< @/zh-TW/.examples/community/faq-nested.ts

## 我應該永遠維持 zero-config 嗎？

通常不該。Zero-config 只是 onboarding 的便利功能。只要模式開始變成共享慣例，真實專案就應該把 naming、variables、selectors、shortcuts 與 plugins 集中到 config 裡。

## 我該編輯 `pika.gen.ts` 或 `pika.gen.css` 嗎？

不該。這兩個檔案都是 generated artifacts。請改 engine config、原始碼用法，或 integration wiring。

## 什麼時候該使用 ESLint integration？

越早越好。它能在 codebase 還沒有穩定慣例之前，阻止 runtime-style 習慣擴散。

## 當設定看起來不對時，我該先檢查什麼？

先從 scan coverage、generated files，以及 generated CSS 是否真的有匯入開始。這三項通常比猜測性的 config 調整更快解釋大多數設定失敗。

## Next

- [Static Constraints](/zh-TW/getting-started/static-arguments)
- [Common Problems](/zh-TW/troubleshooting/common-problems)
- [Configuration](/zh-TW/guide/configuration)
- [Plugin System Overview](/zh-TW/plugin-system/overview)
