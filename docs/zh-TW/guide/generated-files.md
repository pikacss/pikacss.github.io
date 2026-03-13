---
description: 了解 PikaCSS 會產生哪些檔案、它們為什麼存在，以及如何用它們來排查設定問題。
---

# Generated Files

PikaCSS 會刻意產生這些檔案。它們不是附帶的 build 雜訊，而是越早理解，就越容易除錯 engine 的重要線索。

對剛開始採用的人來說，這些 artifacts 也是最快證明掃描、config 載入與 CSS 輸出確實有發生的方法。

## `pika.css`

`pika.css` 是一個 virtual module。你會從 app entry 匯入它，但不會把它當成原始碼檔來編輯。

<<< @/zh-TW/.examples/integrations/import-pika-css.ts

把它視為 generated CSS 對 bundler 暴露的入口，而不是你要手動維護的真實檔案。

## `pika.gen.ts`

`pika.gen.ts` 內含產生出來的 TypeScript 支援。editor autocomplete 之所以知道 selectors、shortcuts、variables、plugins，以及來自 engine config 的自訂 tokens，就是因為這個檔案。

如果 autocomplete 看起來不完整或過期，這個檔案通常是最早該檢查的地方之一。

## `pika.gen.css`

`pika.gen.css` 是 integration 寫到磁碟上的 generated CSS。

::: warning 不要編輯 generated files
generated files 會被覆蓋。如果輸出有問題，應該回去修原始樣式定義、engine config，或 integration 設定，而不是直接補 generated artifact。
:::

預設情況下，integrations 會把 `pika.gen.ts` 和 `pika.gen.css` 寫在專案根目錄。如果 integration config 覆寫了 `tsCodegen` 或 `cssCodegen`，就應該把那些設定好的路徑視為真正的 artifact 位置。

## 什麼時候 generated files 很有用

Generated files 是很好的診斷工具：

- 確認某個 `pika()` 呼叫有被抽取
- 檢查輸出的 declarations 與 selector 展開
- 驗證預期的 tokens 與 autocomplete 項目是否真的有生成

當設定行為不如預期時，generated files 通常能直接告訴你，問題是出在抽取、config 解析，還是 integration 接線。

它們也屬於日常工作流的一部分，不只是發生緊急狀況時才拿來除錯。當你加入新的 selector family、修改共享 config，或不確定新的 `pika()` 呼叫是否按照預期被抽取時，都應該檢查它們。

## 什麼時候 generated files 不是答案

- 它們不是自訂 design tokens 的地方。
- 它們不是修 selector aliases 的地方。
- 它們不是加入 plugins 或 preflights 的地方。

這些改動都應該回到原始碼或 config，而不是 generated output。

## 輸出 helpers 與 preview variants

Generated files 也有助於理解為什麼 PikaCSS 會提供多種輸出 helpers。

- `pika()` 會跟隨 integration 設定的預設輸出格式。
- `pika.str()` 會強制輸出 string。
- `pika.arr()` 會強制輸出 array。
- `pikap()` 以及它的 `.str()` / `.arr()` variants，會在保留 preview workflow 的同時，遵守相同的輸出形狀規則。

如果某個 call site 需要固定的輸出形狀，就用對應的 helper，然後至少檢查一次 generated output，確認 build 真的產生了你預期的結果。

基本的輸出形狀範例請看 [First Pika](/zh-TW/getting-started/first-pika)。

## 一個簡單的日常工作流

1. 從 application entry 匯入一次 `pika.css`。
2. 在 integration 尚未完全驗證前，先保留一個字面值 `pika()` 呼叫在附近。
3. 當你要確認抽取或 selector 展開時，檢查 `pika.gen.css`。
4. 當 autocomplete、selectors、shortcuts 或 variables 看起來不完整時，檢查 `pika.gen.ts`。
5. 發現問題時，回到 source 或 config 修正，而不是直接編輯 generated output。

## 一個簡單的除錯順序

1. 確認原始碼檔裡有受支援的靜態 `pika()` 呼叫。
2. 確認應用程式有匯入 `pika.css`。
3. 檢查 `pika.gen.ts` 與 `pika.gen.css`，看看 build 實際輸出了什麼。
4. 如果輸出還是缺東西，再去檢查 config discovery 與 ESLint warnings。

如果做完這四步仍然不清楚問題在哪裡，就繼續看 [Common Problems](/zh-TW/troubleshooting/common-problems)，不要一次亂改多個 config 旋鈕。

## Next

- [ESLint](/zh-TW/integrations/eslint)
- [PikaCSS 如何運作](/zh-TW/concepts/how-pikacss-works)
- [設定方式](/zh-TW/guide/configuration)
- [常見問題](/zh-TW/troubleshooting/common-problems)
