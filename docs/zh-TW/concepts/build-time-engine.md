---
description: 了解為什麼 PikaCSS 在 build 過程中運作、瀏覽器實際收到的是什麼，以及如何在不破壞抽取模型的前提下表達動態需求。
---

# Build-time Engine

只要記住一條規則，PikaCSS 就會容易理解很多：styling engine 跑在 build 過程，不是在瀏覽器裡執行。

## Zero runtime 代表瀏覽器拿到的是字串和 CSS

經過轉換後，正式環境 bundle 裡只會留下靜態 class names 和 generated CSS。頁面載入時，不會再有用戶端 styling engine 去解析 style objects。

<<< @/zh-TW/.examples/principles/zero-source.ts

<<< @/zh-TW/.examples/principles/zero-compiled.ts

<<< @/zh-TW/.examples/principles/zero-generated.css

## 為什麼靜態輸入沒有協商空間

build-time 架構帶來幾個直接的好處：

- deterministic output
- atomic deduplication
- generated autocomplete
- 由 plugin 控制的 config resolution

同時也代表你必須用靜態形狀來表達變化，例如 variants、selectors、shortcuts 與 variables。

這不是任意限制，而是讓整個系統成立的前提。

## Virtual modules 和 generated files 本來就是這套契約的一部分

`pika.css` 這個 import 是一個 virtual module。它會在 build-time 解析成產生的 CSS。在磁碟上，integration 也可能寫出像是 `pika.gen.ts` 與 `pika.gen.css` 這樣的檔案。

在把任何 generated artifact 當成原始碼之前，先讀 [Generated Files](/zh-TW/guide/generated-files)。

## 先問對設計問題

不要問：「我要怎麼讓 `pika()` 接受這個 runtime value？」

要問的是：「我的專案應該用哪一種靜態表示法來編碼這個 styling 問題？」

很多時候，只要換成這個角度思考，最後得到的設計也會更好。

## 團隊通常會改成這些表示法

- 用 variants 取代 runtime 動態組出的 style objects
- 用 selectors 取代重複的 raw pseudo 與 media syntax
- 用 variables 取代塞進 `pika()` 裡的 runtime 計算值
- 用 shortcuts 取代反覆複製的靜態 style bundles

## Next

- [靜態限制](/zh-TW/getting-started/static-arguments)
- [Generated Files](/zh-TW/guide/generated-files)
- [Responsive And Selectors](/zh-TW/patterns/responsive-and-selectors)
- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
