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

## 什麼時候 generated files 很有用

Generated files 是很好的診斷工具：

- 確認某個 `pika()` 呼叫有被抽取
- 檢查輸出的 declarations 與 selector 展開
- 驗證預期的 tokens 與 autocomplete 項目是否真的有生成

當設定行為不如預期時，generated files 通常能直接告訴你，問題是出在抽取、config 解析，還是 integration 接線。

## 什麼時候 generated files 不是答案

- 它們不是自訂 design tokens 的地方。
- 它們不是修 selector aliases 的地方。
- 它們不是加入 plugins 或 preflights 的地方。

這些改動都應該回到原始碼或 config，而不是 generated output。

## 一個簡單的除錯順序

1. 確認原始碼檔裡有受支援的靜態 `pika()` 呼叫。
2. 確認應用程式有匯入 `pika.css`。
3. 檢查 `pika.gen.ts` 與 `pika.gen.css`，看看 build 實際輸出了什麼。
4. 如果輸出還是缺東西，再去檢查 config discovery 與 ESLint warnings。

## Next

- [ESLint](/zh-TW/integrations/eslint)
- [How PikaCSS Works](/zh-TW/concepts/how-pikacss-works)
- [Configuration](/zh-TW/guide/configuration)
- [Common Problems](/zh-TW/troubleshooting/common-problems)
