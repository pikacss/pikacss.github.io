---
description: 在盲目調整 config 之前，先從 scan 範圍、generated files、靜態輸入與 plugin wiring 排查最常見的 PikaCSS 問題。
---

# Common Problems

當 PikaCSS 輸出看起來不對時，原因通常不是 engine 深層 bug，而是少數幾種一再出現的典型問題。這一頁專注在那些能最快排除常見錯誤的檢查。

## `pika()` 沒有產生我預期的內容

先檢查下面幾點：

1. 原始碼檔案是否包含在 scan patterns 裡？
2. 產生的 CSS 檔是否真的有匯入到應用程式？
3. `pika()` 輸入是否足夠靜態，讓 build 可以理解？
4. 你是否有實際檢查 generated CSS 或 generated typings，而不是只靠猜測？

這四項檢查能排除大多數第一次遇到的失敗情況。如果它們本身就有問題，再加更多 config 通常只會讓真正原因更難看見。

## 我在 `pika()` 裡用了 runtime values

這是最常見的失敗模式。

<<< @/zh-TW/.examples/community/faq-static-bad.pikainput.ts

PikaCSS 需要 build-time 可讀的輸入。當 styling 選擇真的來自 runtime 資料時，請把 runtime 那一部分移到 CSS variables，並讓樣式形狀保持靜態。

<<< @/zh-TW/.examples/community/faq-static-ok.pikainput.ts

請參考 [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)，那裡說明了如何在保留靜態抽取的前提下，仍然允許每個實例使用不同值。

## 我編輯了 generated files，但修改消失了

Generated files 是輸出 artifacts，不是 source files。請改原始的 `pika()` 呼叫、engine config、plugin 設定或 integration wiring。如果 generated files 一直出現讓你意外的變化，真正的 source of truth 仍然在上游。

## 我加了 plugin，但什麼都沒變

請先確認你是在設定 built-in core feature，還是在註冊外部 plugin。這是兩種不同的擴充介面。也請確認 plugin 真的出現在 `plugins` 裡，而不是只安裝在 `package.json` 裡。

如果 plugin 已在 `plugins` 裡但仍然沒有任何效果，在每個 hook 的頂部加上 `console.log` 來確認 hooks 是否有被呼叫。如果沒有任何 log 出現，plugin 可能有初始化錯誤——請在 build 輸出中尋找被攔截的例外。

## 我的 plugin hook 有觸發，但輸出不對

確認你的 hook 使用的是 `configureEngine` 還是 transform hook。如果你在 `configureEngine` 裡呼叫 `engine.appendSelectors()`，這個登記是永久且累加的。如果你使用 `transformSelectors`，你是在改寫在 plugins 之間流動的 payload——請回傳完整的替換版本，而不是對輸入的 mutation。

如果輸出看起來和預設值一樣、忽略了你的 plugin，請確認 plugin 的 `order` 設定。`post` plugin 最後執行，但到那時某些 engine 狀態已經確定了。

## 我的 plugin 單獨運作正常，但與其他 plugin 組合時壞掉了

這是 payload chaining 問題。Transform hooks 會把回傳值傳給下一個 plugin。如果 Plugin A 過濾了 payload 而 Plugin B 預期的是原始形狀，Plugin B 就會靜默跳過它的邏輯。

排查方式：在兩個 plugins 的每個 transform hook 開頭都記錄 hook 輸入。如果 Plugin B 收到的項目比預期少，Plugin A 正在過濾它們。

修正方式：要麼用 `order: 'pre'` 讓 Plugin B 在 Plugin A 之前執行，要麼讓 Plugin B 能優雅地處理縮減後的 payload。

## 我的 preflight styles 影響到了我沒有預期的頁面

Preflights 在 component styles 執行之前，全域套用到每一頁。如果 preflight 包含 component 層級的規則，那些規則就會出現在所有地方。

請把 component 專屬的 styles 移出 preflights，改用 `pika()` 呼叫或共享的 shortcut recipes 來處理。

## 我的主題邏輯感覺很重複

這通常代表值應該放進 variables，而主題情境應該放進 selectors。如果每個 component 都在重複相同的原始顏色決策，表示專案還沒有把 design tokens 集中好。

## Build 能跑，但團隊用法開始偏掉

請盡早加上 ESLint integration，然後把反覆出現的慣例搬進 config 層級的 selectors、shortcuts 和 variables。當共享 vocabulary 活在 config 裡，而不是在每個 component 中重複被重新發明時，PikaCSS 才會保持可維護。

## Next

- [Static Constraints](/zh-TW/getting-started/static-arguments)
- [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)
- [Generated Files](/zh-TW/guide/generated-files)
- [ESLint](/zh-TW/integrations/eslint)
